FROM nixos/nix

WORKDIR /app

# Copy flake files first to cache dependencies
COPY flake.nix flake.lock ./

# Pre-build dependencies (this gets cached unless flake.nix/lock changes)
RUN nix develop . --extra-experimental-features nix-command --extra-experimental-features flakes --command true

# Now copy the rest of the app
COPY . .

EXPOSE 8000

# Run the app inside the dev shell
CMD ["nix", "develop", ".", "--extra-experimental-features", "nix-command", "--extra-experimental-features", "flakes", "--command", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
