generate-rs256-private-key:
	openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:4096
generate-rs256-public-key:
	openssl rsa -pubout -in private_key.pem -out public_key.pem