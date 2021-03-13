RUN_ARGS=--unstable --allow-net --allow-read --import-map ./import_map.json 
BUNDLE_ARGS=--unstable --import-map ./import_map.json --config ./taro/client/tsconfig.json
# COMPILE_ARGS=--unstable -A src/server/server.ts 


run: 
	deno run $(RUN_ARGS) example/server.ts

dev: bundle
	deno run --watch $(RUN_ARGS) example/server.ts

bundle:
	deno bundle $(BUNDLE_ARGS) example/client.ts example/assets/example.js

# compile: bundle
# 	deno compile $(COMPILE_ARGS)

# build-image:
# 	docker build . -t touchblitz:latest

# run-image:
# 	docker run -it -p 8080:8080 touchblitz:latest