module.exports = {
  networks: {
    development: {
      host: '192.168.1.101', // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: '*', // Any network (default: none)
    },
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },
  contracts_directory: './contracts',
  contracts_build_directory: './public/abis/contracts',

  // Configure your compilers
  compilers: {
    solc: {
      version: '0.8.14', // Fetch exact version from solc-bin (default: truffle's version)

      // }
    },
  },
};
