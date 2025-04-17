{
  description = "Dev environment for Vite + React + TypeScript + Python";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };

        python = pkgs.python311;

        # Disable testing via jupyterlab instead of jupyter-server to avoid collision
        # jupyterlabNoTests = pkgs.python311Packages.jupyterlab.overridePythonAttrs (old: {
        #   doCheck = false;
        #   dontCheck = true;
        # });

        pythonEnv = python.withPackages (ps: with ps; [
          seaborn
          numpy
          pandas
          matplotlib
          ipykernel
          # jupyterlabNoTests
          scipy
          statsmodels
          scikitlearn
          notebook # Jupyter Notebook
          ipywidgets
          pip
          uvicorn
          fastapi
        ]);
        in {
        devShells.default = pkgs.mkShell {
          packages = [
            pythonEnv

            pkgs.nodejs_23
            pkgs.pnpm_10
            pkgs.eslint
            pkgs.nodePackages_latest.vercel

            pkgs.git-lfs
            pkgs.git-filter-repo

            pkgs.heroku
          ];

          shellHook = ''
            echo "Welcome Back Sir,"
            echo "Here are the installed packages:"
            echo "- nodejs_23"
            echo "- pnpm_10"
            echo "- eslint"
            echo "- vercel@latest"
            echo "- Python 3.11 with seaborn, pandas, numpy, matplotlib, jupyterlab"
          '';
        };
      }
    );
}
