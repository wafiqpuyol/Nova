#Makefile

protoc:
	cd proto && protoc --proto_path=definitions --go_out=. --go-grpc_out=. --grpc-gateway_out=. definitions/*.proto definitions/types/*.proto