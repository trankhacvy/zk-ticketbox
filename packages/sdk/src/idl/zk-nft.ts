export type ZkNft = {
  version: "0.1.0";
  name: "zk_nft";
  instructions: [
    {
      name: "createAsset";
      accounts: [
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "cpiSigner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "selfProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
          isOptional: true;
        },
        {
          name: "updateAuthority";
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: "lightSystemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "accountCompressionProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "registeredProgramPda";
          isMut: false;
          isSigner: false;
        },
        {
          name: "noopProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "accountCompressionAuthority";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "inputs";
          type: {
            defined: "LightInstructionData";
          };
        },
        {
          name: "collectionInputs";
          type: {
            option: {
              defined: "LightInstructionData";
            };
          };
        },
        {
          name: "args";
          type: {
            defined: "CreateV1Args";
          };
        },
      ];
    },
    {
      name: "createCollection";
      accounts: [
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "cpiSigner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "selfProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "updateAuthority";
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: "lightSystemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "accountCompressionProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "registeredProgramPda";
          isMut: false;
          isSigner: false;
        },
        {
          name: "noopProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "accountCompressionAuthority";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "inputs";
          type: {
            defined: "LightInstructionData";
          };
        },
        {
          name: "args";
          type: {
            defined: "CreateCollectionV1Args";
          };
        },
      ];
    },
  ];
  types: [
    {
      name: "PackedAddressMerkleContext";
      type: {
        kind: "struct";
        fields: [
          {
            name: "addressMerkleTreePubkeyIndex";
            type: "u8";
          },
          {
            name: "addressQueuePubkeyIndex";
            type: "u8";
          },
        ];
      };
    },
    {
      name: "PackedMerkleContext";
      type: {
        kind: "struct";
        fields: [
          {
            name: "merkleTreePubkeyIndex";
            type: "u8";
          },
          {
            name: "nullifierQueuePubkeyIndex";
            type: "u8";
          },
          {
            name: "leafIndex";
            type: "u32";
          },
          {
            name: "queueIndex";
            docs: [
              "Index of leaf in queue. Placeholder of batched Merkle tree updates",
              "currently unimplemented.",
            ];
            type: {
              option: {
                defined: "QueueIndex";
              };
            };
          },
        ];
      };
    },
    {
      name: "QueueIndex";
      type: {
        kind: "struct";
        fields: [
          {
            name: "queueId";
            docs: ["Id of queue in queue account."];
            type: "u8";
          },
          {
            name: "index";
            docs: ["Index of compressed account hash in queue."];
            type: "u16";
          },
        ];
      };
    },
    {
      name: "AssetV1";
      type: {
        kind: "struct";
        fields: [
          {
            name: "key";
            docs: ["The account discriminator."];
            type: {
              defined: "Key";
            };
          },
          {
            name: "owner";
            docs: ["The owner of the asset."];
            type: "publicKey";
          },
          {
            name: "updateAuthority";
            docs: ["The update authority of the asset."];
            type: {
              defined: "UpdateAuthority";
            };
          },
          {
            name: "name";
            docs: ["The name of the asset."];
            type: "string";
          },
          {
            name: "uri";
            docs: ["The URI of the asset that points to the off-chain data."];
            type: "string";
          },
        ];
      };
    },
    {
      name: "CollectionV1";
      type: {
        kind: "struct";
        fields: [
          {
            name: "key";
            docs: ["The account discriminator."];
            type: {
              defined: "Key";
            };
          },
          {
            name: "updateAuthority";
            docs: ["The update authority of the collection."];
            type: "publicKey";
          },
          {
            name: "name";
            docs: ["The name of the collection."];
            type: "string";
          },
          {
            name: "uri";
            docs: [
              "The URI that links to what data to show for the collection.",
            ];
            type: "string";
          },
          {
            name: "numMinted";
            docs: ["The number of assets minted in the collection."];
            type: "u32";
          },
          {
            name: "currentSize";
            docs: ["The number of assets currently in the collection."];
            type: "u32";
          },
        ];
      };
    },
    {
      name: "CreateCollectionV1Args";
      type: {
        kind: "struct";
        fields: [
          {
            name: "derivationKey";
            type: "publicKey";
          },
          {
            name: "name";
            type: "string";
          },
          {
            name: "uri";
            type: "string";
          },
          {
            name: "collection";
            type: {
              option: {
                defined: "CollectionV1";
              };
            };
          },
        ];
      };
    },
    {
      name: "CreateV1Args";
      type: {
        kind: "struct";
        fields: [
          {
            name: "derivationKey";
            type: "publicKey";
          },
          {
            name: "name";
            type: "string";
          },
          {
            name: "uri";
            type: "string";
          },
          {
            name: "collectionKey";
            type: {
              option: "publicKey";
            };
          },
          {
            name: "asset";
            type: {
              option: {
                defined: "AssetV1";
              };
            };
          },
        ];
      };
    },
    {
      name: "Key";
      type: {
        kind: "enum";
        variants: [
          {
            name: "Uninitialized";
          },
          {
            name: "AssetV1";
          },
          {
            name: "CollectionV1";
          },
        ];
      };
    },
    {
      name: "LightInstructionData";
      type: {
        kind: "struct";
        fields: [
          {
            name: "inputs";
            type: {
              vec: "bytes";
            };
          },
          {
            name: "proof";
            type: {
              defined: "AnchorCompressedProof";
            };
          },
          {
            name: "merkleContext";
            type: {
              defined: "PackedMerkleContext";
            };
          },
          {
            name: "merkleTreeRootIndex";
            type: "u16";
          },
          {
            name: "addressMerkleContext";
            type: {
              defined: "PackedAddressMerkleContext";
            };
          },
          {
            name: "addressMerkleTreeRootIndex";
            type: "u16";
          },
        ];
      };
    },
    {
      name: "UpdateAuthority";
      type: {
        kind: "enum";
        variants: [
          {
            name: "None";
          },
          {
            name: "Address";
            fields: ["publicKey"];
          },
          {
            name: "Collection";
            fields: ["publicKey"];
          },
        ];
      };
    },
    {
      name: "AnchorCompressedProof";
      type: {
        kind: "struct";
        fields: [
          {
            name: "a";
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "b";
            type: {
              array: ["u8", 64];
            };
          },
          {
            name: "c";
            type: {
              array: ["u8", 32];
            };
          },
        ];
      };
    },
  ];
  errors: [
    {
      code: 6000;
      name: "EventNameTooLong";
      msg: "Event name is too long. Maximum is 50 characters.";
    },
    {
      code: 6001;
      name: "EventDescriptionTooLong";
      msg: "Event description is too long. Maximum is 200 characters.";
    },
    {
      code: 6002;
      name: "EventInactive";
      msg: "Event is inactive.";
    },
    {
      code: 6003;
      name: "MaxSupplyReached";
      msg: "Maximum supply reached.";
    },
    {
      code: 6004;
      name: "AlreadyAttended";
      msg: "User has already attended this event.";
    },
    {
      code: 6005;
      name: "Unauthorized";
      msg: "Unauthorized action.";
    },
    {
      code: 6006;
      name: "MintNotLive";
      msg: "Mint is not live yet.";
    },
    {
      code: 6007;
      name: "AfterEndDate";
      msg: "Mint is already over.";
    },
    {
      code: 6008;
      name: "ConflictingAuthority";
      msg: "Conflicting NFT authority.";
    },
    {
      code: 6009;
      name: "NumericalOverflow";
      msg: "Numerical overflow.";
    },
  ];
};

export const IDL: ZkNft = {
  version: "0.1.0",
  name: "zk_nft",
  instructions: [
    {
      name: "createAsset",
      accounts: [
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "cpiSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "selfProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
          isOptional: true,
        },
        {
          name: "updateAuthority",
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: "lightSystemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "accountCompressionProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "registeredProgramPda",
          isMut: false,
          isSigner: false,
        },
        {
          name: "noopProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "accountCompressionAuthority",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "inputs",
          type: {
            defined: "LightInstructionData",
          },
        },
        {
          name: "collectionInputs",
          type: {
            option: {
              defined: "LightInstructionData",
            },
          },
        },
        {
          name: "args",
          type: {
            defined: "CreateV1Args",
          },
        },
      ],
    },
    {
      name: "createCollection",
      accounts: [
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "cpiSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "selfProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "updateAuthority",
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: "lightSystemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "accountCompressionProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "registeredProgramPda",
          isMut: false,
          isSigner: false,
        },
        {
          name: "noopProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "accountCompressionAuthority",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "inputs",
          type: {
            defined: "LightInstructionData",
          },
        },
        {
          name: "args",
          type: {
            defined: "CreateCollectionV1Args",
          },
        },
      ],
    },
  ],
  types: [
    {
      name: "PackedAddressMerkleContext",
      type: {
        kind: "struct",
        fields: [
          {
            name: "addressMerkleTreePubkeyIndex",
            type: "u8",
          },
          {
            name: "addressQueuePubkeyIndex",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "PackedMerkleContext",
      type: {
        kind: "struct",
        fields: [
          {
            name: "merkleTreePubkeyIndex",
            type: "u8",
          },
          {
            name: "nullifierQueuePubkeyIndex",
            type: "u8",
          },
          {
            name: "leafIndex",
            type: "u32",
          },
          {
            name: "queueIndex",
            docs: [
              "Index of leaf in queue. Placeholder of batched Merkle tree updates",
              "currently unimplemented.",
            ],
            type: {
              option: {
                defined: "QueueIndex",
              },
            },
          },
        ],
      },
    },
    {
      name: "QueueIndex",
      type: {
        kind: "struct",
        fields: [
          {
            name: "queueId",
            docs: ["Id of queue in queue account."],
            type: "u8",
          },
          {
            name: "index",
            docs: ["Index of compressed account hash in queue."],
            type: "u16",
          },
        ],
      },
    },
    {
      name: "AssetV1",
      type: {
        kind: "struct",
        fields: [
          {
            name: "key",
            docs: ["The account discriminator."],
            type: {
              defined: "Key",
            },
          },
          {
            name: "owner",
            docs: ["The owner of the asset."],
            type: "publicKey",
          },
          {
            name: "updateAuthority",
            docs: ["The update authority of the asset."],
            type: {
              defined: "UpdateAuthority",
            },
          },
          {
            name: "name",
            docs: ["The name of the asset."],
            type: "string",
          },
          {
            name: "uri",
            docs: ["The URI of the asset that points to the off-chain data."],
            type: "string",
          },
        ],
      },
    },
    {
      name: "CollectionV1",
      type: {
        kind: "struct",
        fields: [
          {
            name: "key",
            docs: ["The account discriminator."],
            type: {
              defined: "Key",
            },
          },
          {
            name: "updateAuthority",
            docs: ["The update authority of the collection."],
            type: "publicKey",
          },
          {
            name: "name",
            docs: ["The name of the collection."],
            type: "string",
          },
          {
            name: "uri",
            docs: [
              "The URI that links to what data to show for the collection.",
            ],
            type: "string",
          },
          {
            name: "numMinted",
            docs: ["The number of assets minted in the collection."],
            type: "u32",
          },
          {
            name: "currentSize",
            docs: ["The number of assets currently in the collection."],
            type: "u32",
          },
        ],
      },
    },
    {
      name: "CreateCollectionV1Args",
      type: {
        kind: "struct",
        fields: [
          {
            name: "derivationKey",
            type: "publicKey",
          },
          {
            name: "name",
            type: "string",
          },
          {
            name: "uri",
            type: "string",
          },
          {
            name: "collection",
            type: {
              option: {
                defined: "CollectionV1",
              },
            },
          },
        ],
      },
    },
    {
      name: "CreateV1Args",
      type: {
        kind: "struct",
        fields: [
          {
            name: "derivationKey",
            type: "publicKey",
          },
          {
            name: "name",
            type: "string",
          },
          {
            name: "uri",
            type: "string",
          },
          {
            name: "collectionKey",
            type: {
              option: "publicKey",
            },
          },
          {
            name: "asset",
            type: {
              option: {
                defined: "AssetV1",
              },
            },
          },
        ],
      },
    },
    {
      name: "Key",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Uninitialized",
          },
          {
            name: "AssetV1",
          },
          {
            name: "CollectionV1",
          },
        ],
      },
    },
    {
      name: "LightInstructionData",
      type: {
        kind: "struct",
        fields: [
          {
            name: "inputs",
            type: {
              vec: "bytes",
            },
          },
          {
            name: "proof",
            type: {
              defined: "AnchorCompressedProof",
            },
          },
          {
            name: "merkleContext",
            type: {
              defined: "PackedMerkleContext",
            },
          },
          {
            name: "merkleTreeRootIndex",
            type: "u16",
          },
          {
            name: "addressMerkleContext",
            type: {
              defined: "PackedAddressMerkleContext",
            },
          },
          {
            name: "addressMerkleTreeRootIndex",
            type: "u16",
          },
        ],
      },
    },
    {
      name: "UpdateAuthority",
      type: {
        kind: "enum",
        variants: [
          {
            name: "None",
          },
          {
            name: "Address",
            fields: ["publicKey"],
          },
          {
            name: "Collection",
            fields: ["publicKey"],
          },
        ],
      },
    },
    {
      name: "AnchorCompressedProof",
      type: {
        kind: "struct",
        fields: [
          {
            name: "a",
            type: {
              array: ["u8", 32],
            },
          },
          {
            name: "b",
            type: {
              array: ["u8", 64],
            },
          },
          {
            name: "c",
            type: {
              array: ["u8", 32],
            },
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "EventNameTooLong",
      msg: "Event name is too long. Maximum is 50 characters.",
    },
    {
      code: 6001,
      name: "EventDescriptionTooLong",
      msg: "Event description is too long. Maximum is 200 characters.",
    },
    {
      code: 6002,
      name: "EventInactive",
      msg: "Event is inactive.",
    },
    {
      code: 6003,
      name: "MaxSupplyReached",
      msg: "Maximum supply reached.",
    },
    {
      code: 6004,
      name: "AlreadyAttended",
      msg: "User has already attended this event.",
    },
    {
      code: 6005,
      name: "Unauthorized",
      msg: "Unauthorized action.",
    },
    {
      code: 6006,
      name: "MintNotLive",
      msg: "Mint is not live yet.",
    },
    {
      code: 6007,
      name: "AfterEndDate",
      msg: "Mint is already over.",
    },
    {
      code: 6008,
      name: "ConflictingAuthority",
      msg: "Conflicting NFT authority.",
    },
    {
      code: 6009,
      name: "NumericalOverflow",
      msg: "Numerical overflow.",
    },
  ],
};
