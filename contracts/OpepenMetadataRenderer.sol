// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Base64                     } from "@openzeppelin/contracts/utils/Base64.sol";
import { Strings                    } from "@openzeppelin/contracts/utils/Strings.sol";
import { IERC721Drop                } from "./interfaces/IERC721Drop.sol";
import { IMetadataRenderer          } from "./interfaces/IMetadataRenderer.sol";
import { ISetArtifactRenderer       } from "./interfaces/ISetArtifactRenderer.sol";
import { NFTMetadataRenderer        } from "./libraries/NFTMetadataRenderer.sol";
import { SetData                    } from "./types/SetData.sol";
import { MetadataRenderAdminCheck   } from "./MetadataRenderAdminCheck.sol";
import { TheOpepenArchive           } from "./TheOpepenArchive.sol";

/// @title  Opepen Metadata Renderer
/// @author VisualizeValue
/// @notice Renders Metadata for Opepen
contract OpepenMetadataRenderer is IMetadataRenderer, MetadataRenderAdminCheck {
    /// @notice The Opepen Archive address
    TheOpepenArchive public archive;

    constructor (address archive_) {
        archive = TheOpepenArchive(archive_);
    }

    /// @notice Contract URI information getter
    /// @return contract uri (if set)
    function contractURI() external view override returns (string memory) {
        bytes memory dataURI = abi.encodePacked('{'
            '"name": "Opepen",'
            '"description": "', archive.description, '",'
            '"image": "ipfs://bafybeidhmw3gazojgwqieyhj2ace23qdyt3frmirt4pe25jgzn4veeza3q"'
        '}');

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    function tokenName (
        uint256 id,
        uint8 tokenSet,
        uint8 tokenEdition,
        SetData memory setData
    ) internal pure returns (string memory) {
        return tokenSet > 0
            ? setData.name
            : string(abi.encodePacked(
                'Unrevealed, 1/', Strings.toString(tokenEdition), ' '
                '(#', id, ')'
            ));
    }

    function renderTokenEdition (uint8 tokenEdition) internal pure returns (string memory) {
        return tokenEdition ==  1 ? 'One'
             : tokenEdition ==  4 ? 'Four'
             : tokenEdition ==  5 ? 'Five'
             : tokenEdition == 10 ? 'Ten'
             : tokenEdition == 20 ? 'Twenty'
                                  : 'Forty';
    }

    function renderRevealed (uint8 tokenSet) internal pure returns (string memory) {
        return tokenSet > 0 ? 'Yes' : 'No';
    }

    function renderArtifact(
        uint256 id,
        uint8 tokenEdition,
        uint8 tokenSetEditionIndex,
        SetData memory setData
    ) internal view returns (bytes memory) {
        address artifactRendererAddress = archive.setArtifactRenderer(id);
        ISetArtifactRenderer artifactRenderer = ISetArtifactRenderer(artifactRendererAddress);

        string memory image = artifactRendererAddress != address(0)
            ? artifactRenderer.imageUrl(id, tokenEdition, tokenSetEditionIndex)
            : string(abi.encodePacked("ipfs://", setData.imageCid));

        string memory animationUrl = artifactRendererAddress != address(0)
            ? artifactRenderer.animationUrl(id, tokenEdition, tokenSetEditionIndex)
            : string(abi.encodePacked("ipfs://", setData.animationCid));

        return abi.encodePacked(
            '"image": "', image, '",',
            bytes(animationUrl).length > 0
                ? string(abi.encodePacked('"animation_url": "', animationUrl, '",'))
                : ''
        );
    }

    /// @notice Token URI information getter
    /// @param id to get uri for
    /// @return contract uri (if set)
    function tokenURI(uint256 id) external view returns (string memory) {
        // Gather data
        uint8 tokenSet             = archive.getTokenSet(id);
        uint8 tokenSetEditionIndex = archive.getTokenSetEditionId(id);
        uint8 tokenEdition         = archive.getTokenEdition(id);
        SetData memory setData     = archive.getSetData(id);

        // Transform data
        string memory tokenId = Strings.toString(id);

        bytes memory dataURI = abi.encodePacked('{'
            '"id": "', tokenId, '",'
            '"name": "', tokenName(id, tokenSet, tokenEdition, setData), '",'
            '"description": "', archive.description, '",',
            renderArtifact(id, tokenEdition, tokenSetEditionIndex, setData),
            '"attributes": ['
                '{'
                    '"trait_type": "Edition Size",'
                    '"value": "', renderTokenEdition(tokenEdition), '"'
                '},'
                '{'
                    '"trait_type": "Revealed",'
                    '"value": "', renderRevealed(tokenSet), '"'
                '},'
                '{'
                    '"trait_type": "Number",'
                    '"value": ', tokenId,
                '},'
            ']'
        '}');

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    /// @dev We don't need to do anything in here, as we don't hold this data onchain.
    /// @param data data to init with
    function initializeWithData(bytes memory data) external {
        // ...
    }
}
