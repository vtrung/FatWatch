FatWatch

Installation:

1. install packages: run 'npm install'
2. create keys for jwt tokens
	# Generate jwtkeys
ssh-keygen -t rsa -b 4096 -f jwtRS256.key

# Don't add passphrase
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
cat jwtRS256.key
cat jwtRS256.key.pub

3. run mongo

service mongodb start



