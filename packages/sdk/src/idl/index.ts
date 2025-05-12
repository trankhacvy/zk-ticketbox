export type Ticketbox = {
  version: "0.1.0";
  name: "ticketbox";
  instructions: [
    {
      name: "initializeTicketbox";
      accounts: [
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "selfProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "cpiSigner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "zkNftProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "zkNftCpiAuthorityPda";
          isMut: false;
          isSigner: false;
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
            defined: "ticketbox::state::LightInstructionData";
          };
        },
        {
          name: "collectionInputs";
          type: {
            defined: "zk_nft::state::LightInstructionData";
          };
        },
        {
          name: "params";
          type: {
            defined: "CreateTicketBoxParams";
          };
        },
        {
          name: "collectionKey";
          type: "publicKey";
        },
      ];
    },
    {
      name: "mintPop";
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
          name: "zkNftProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "zkNftCpiAuthorityPda";
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
            defined: "ticketbox::state::LightInstructionData";
          };
        },
        {
          name: "nftInputs";
          type: {
            defined: "zk_nft::state::LightInstructionData";
          };
        },
        {
          name: "assetKey";
          type: "publicKey";
        },
      ];
    },
    {
      name: "mintPopV2";
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
          name: "zkNftProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "zkNftCpiAuthorityPda";
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
          name: "nftInputs";
          type: {
            defined: "zk_nft::state::LightInstructionData";
          };
        },
        {
          name: "assetKey";
          type: "publicKey";
        },
        {
          name: "eventName";
          type: "string";
        },
        {
          name: "metadataUri";
          type: "string";
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
      name: "CreateTicketBoxParams";
      type: {
        kind: "struct";
        fields: [
          {
            name: "eventId";
            type: "string";
          },
          {
            name: "eventName";
            type: "string";
          },
          {
            name: "metadataUri";
            type: "string";
          },
          {
            name: "startAt";
            type: "i64";
          },
          {
            name: "endAt";
            type: "i64";
          },
          {
            name: "maxSupply";
            type: "u64";
          },
        ];
      };
    },
    {
      name: "ticketbox::state::LightInstructionData";
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
      name: "zk_nft::state::LightInstructionData";
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
  ];
};

export const IDL: Ticketbox = {
  version: "0.1.0",
  name: "ticketbox",
  instructions: [
    {
      name: "initializeTicketbox",
      accounts: [
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "selfProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "cpiSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "zkNftProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "zkNftCpiAuthorityPda",
          isMut: false,
          isSigner: false,
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
            defined: "ticketbox::state::LightInstructionData",
          },
        },
        {
          name: "collectionInputs",
          type: {
            defined: "zk_nft::state::LightInstructionData",
          },
        },
        {
          name: "params",
          type: {
            defined: "CreateTicketBoxParams",
          },
        },
        {
          name: "collectionKey",
          type: "publicKey",
        },
      ],
    },
    {
      name: "mintPop",
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
          name: "zkNftProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "zkNftCpiAuthorityPda",
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
            defined: "ticketbox::state::LightInstructionData",
          },
        },
        {
          name: "nftInputs",
          type: {
            defined: "zk_nft::state::LightInstructionData",
          },
        },
        {
          name: "assetKey",
          type: "publicKey",
        },
      ],
    },
    {
      name: "mintPopV2",
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
          name: "zkNftProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "zkNftCpiAuthorityPda",
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
          name: "nftInputs",
          type: {
            defined: "zk_nft::state::LightInstructionData",
          },
        },
        {
          name: "assetKey",
          type: "publicKey",
        },
        {
          name: "eventName",
          type: "string",
        },
        {
          name: "metadataUri",
          type: "string",
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
      name: "CreateTicketBoxParams",
      type: {
        kind: "struct",
        fields: [
          {
            name: "eventId",
            type: "string",
          },
          {
            name: "eventName",
            type: "string",
          },
          {
            name: "metadataUri",
            type: "string",
          },
          {
            name: "startAt",
            type: "i64",
          },
          {
            name: "endAt",
            type: "i64",
          },
          {
            name: "maxSupply",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "ticketbox::state::LightInstructionData",
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
      name: "zk_nft::state::LightInstructionData",
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
  ],
};
