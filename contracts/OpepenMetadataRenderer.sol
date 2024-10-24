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

    /// @notice Token URI information getter
    /// @param id to get uri for
    /// @return contract uri (if set)
    function tokenURI(uint256 id) external view returns (string memory) {
        // Gather data
        uint8 tokenSet             = archive.getTokenSet(id);
        uint8 tokenSetEditionIndex = archive.getTokenSetEditionId(id);
        uint8 tokenEdition         = archive.getTokenEdition(id);
        SetData memory setData     = archive.getSetData(tokenSet);

        // Transform data
        string memory tokenId = Strings.toString(id);

        bytes memory dataURI = abi.encodePacked('{'
            '"id": "', tokenId, '",'
            '"name": "', tokenName(tokenId, tokenSet, tokenEdition), '",'
            '"description": "', archive.description(), '",',
            renderArtifact(id, tokenSet, tokenEdition, tokenSetEditionIndex, setData),
            '"attributes": [',
                renderTokenAttributes(tokenId, tokenSet, tokenEdition, setData),
            ']'
        '}');

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    /// @dev Render the token name (dependent on whether it's revealed/unrevealed)
    function tokenName (
        string memory id,
        uint8 tokenSet,
        uint8 tokenEdition
    ) internal pure returns (string memory) {
        string memory edition = Strings.toString(tokenEdition);
        return tokenSet > 0
            ? string(abi.encodePacked(
                'Set ', paddedSetId(tokenSet), ', 1/', edition, ' (#', id, ')'
            ))
            : string(abi.encodePacked(
                'Unrevealed, 1/', edition, ' '
                '(#', id, ')'
            ));
    }

    /// @dev Ensure set IDs are three digits (with 0 prepended)
    function paddedSetId (uint8 set) internal pure returns (string memory) {
        string memory id = Strings.toString(set);

        return set < 10
            ? string(abi.encodePacked("00", id))
            : set < 100
            ? string(abi.encodePacked("0", id))
            : id;
    }

    /// @dev Render the token artifact
    function renderArtifact(
        uint256 id,
        uint8 tokenSet,
        uint8 tokenEdition,
        uint8 tokenSetEditionIndex,
        SetData memory setData
    ) internal view returns (bytes memory) {
        address artifactRendererAddress = archive.setArtifactRenderer(tokenSet);
        ISetArtifactRenderer artifactRenderer = ISetArtifactRenderer(artifactRendererAddress);

        string memory image = artifactRendererAddress != address(0)
            ? artifactRenderer.imageUrl(id, tokenEdition, tokenSetEditionIndex)
            : string(abi.encodePacked(
                "ipfs://",
                tokenSet <= 0
                    // TODO: Render blank opepen onchain
                    ? string(abi.encodePacked(
                        'QmVXvZ5Sp6aSDBrWvtJ5gZ3bwNWRqqY3iPvyF8nveWj5HF/',
                        Strings.toString(tokenEdition),
                        '.png'
                      ))
                    : setData.imageCid
            ));

        bool hasAnimationCid = bytes(setData.animationCid).length > 0;
        bool hasCustomRenderer = artifactRendererAddress != address(0);
        string memory animationUrl = hasCustomRenderer
            ? artifactRenderer.animationUrl(id, tokenEdition, tokenSetEditionIndex)
            : string(abi.encodePacked("ipfs://", setData.animationCid));
        bool hasAnimation = hasAnimationCid || (hasCustomRenderer && bytes(animationUrl).length > 0);

        return abi.encodePacked(
            '"image": "', image, '",',
            hasAnimation
                ? string(abi.encodePacked('"animation_url": "', animationUrl, '",'))
                : ''
        );
    }

    /// @dev Render the tokens metadata attributes
    function renderTokenAttributes(
        string memory tokenId,
        uint8 tokenSet,
        uint8 tokenEdition,
        SetData memory setData
    ) internal view returns (string memory) {
        return string(abi.encodePacked(
            '{'
                '"trait_type": "Edition Size",'
                '"value": "', renderTokenEdition(tokenEdition), '"'
            '},'
            '{'
                '"trait_type": "Revealed",'
                '"value": "', renderRevealed(tokenSet), '"'
            '},',
            tokenSet > 0 ? renderTokenSetAttributes(tokenSet, tokenEdition, setData) : '',
            '{'
                '"trait_type": "Number",'
                '"value": ', tokenId,
            '}'
        ));
    }

    /// @dev Render token attributes specific to a set
    function renderTokenSetAttributes(
        uint8 tokenSet,
        uint8 tokenEdition,
        SetData memory setData
    ) internal view returns (string memory) {
        return string(abi.encodePacked(
            '{'
                '"trait_type": "Release",'
                '"value": "', paddedSetId(tokenSet), '"'
            '},'
            '{'
                '"trait_type": "Set",'
                '"value": "', setData.name, '"'
            '},'
            '{'
                '"trait_type": "Artist",'
                '"value": "', setData.artist, '"'
            '},'
            '{'
                '"trait_type": "Opepen",'
                '"value": "',
                    tokenEdition == 1  ? setData.editionOne  :
                    tokenEdition == 4  ? setData.editionFour :
                    tokenEdition == 5  ? setData.editionFive :
                    tokenEdition == 10 ? setData.editionTen  :
                    tokenEdition == 20 ? setData.editionTwenty
                                       : setData.editionForty,
                '"'
            '},'
        ));
    }

    /// @dev Render the token edition as a written word
    function renderTokenEdition (uint8 tokenEdition) internal pure returns (string memory) {
        return tokenEdition ==  1 ? 'One'
             : tokenEdition ==  4 ? 'Four'
             : tokenEdition ==  5 ? 'Five'
             : tokenEdition == 10 ? 'Ten'
             : tokenEdition == 20 ? 'Twenty'
                                  : 'Forty';
    }

    /// @dev Render the revealed state to a string
    function renderRevealed (uint8 tokenSet) internal pure returns (string memory) {
        return tokenSet > 0 ? 'Yes' : 'No';
    }

    /// @dev We don't need to do anything in here, as we don't hold this data onchain.
    /// @param data data to init with
    function initializeWithData(bytes memory data) external {
        // ...
    }
}
