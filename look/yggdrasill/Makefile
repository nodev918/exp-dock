# according to host os to decide protoc source url
HOST_OS := $(shell uname -s)
ifeq ($(HOST_OS), Darwin)
	PROTOC_SUFFIX = osx
else
	ifeq ($(HOST_OS), Linux)
		PROTOC_SUFFIX = linux
	else
		$(error Unsupported Host OS)
	endif
endif

CURRENT_DIR := $(shell pwd)
BUILD_TMP_DIR := $(CURRENT_DIR)/build/tmp
BUILD_BIN_DIR := $(CURRENT_DIR)/build/bin
PROTOC_VER := 3.6.1
PROTOC_SOURCE := https://github.com/protocolbuffers/protobuf/releases/download/v$(PROTOC_VER)/protoc-$(PROTOC_VER)-$(PROTOC_SUFFIX)-x86_64.zip
PROTOC_DESTINATION := $(BUILD_TMP_DIR)/$(notdir $(PROTOC_SOURCE))
PROTOC_CODE_DESTINATION := $(CURRENT_DIR)/src/builds

export PATH := $(GOTOOLS_DIR):$(BUILD_BIN_DIR)/protoc/bin:$(PATH)

fetch-protoc:
	@mkdir -p $(BUILD_TMP_DIR)
	@curl -sL $(PROTOC_SOURCE) -o $(PROTOC_DESTINATION)

unzip-protoc: fetch-protoc
	@mkdir -p $(BUILD_BIN_DIR)
	@unzip -oXq $(PROTOC_DESTINATION) -d $(BUILD_BIN_DIR)/protoc

gen-protoc: unzip-protoc
	@rm -rf $(PROTOC_CODE_DESTINATION)/chat
	@mkdir -p $(PROTOC_CODE_DESTINATION)/chat
	@rm -rf $(PROTOC_CODE_DESTINATION)/google
	@mkdir -p $(PROTOC_CODE_DESTINATION)/google
	@protoc -Irocks/chat --js_out=import_style=commonjs,binary:$(PROTOC_CODE_DESTINATION)/chat socketEntities.proto chatEntities.proto chatting.proto period_chat.proto
	@protoc -Isrc/proto/google --js_out=import_style=commonjs,binary:$(PROTOC_CODE_DESTINATION)/google status.proto error_detail.proto

refresh-protoc:
	@rm -rf $(PROTOC_CODE_DESTINATION)/chat
	@mkdir -p $(PROTOC_CODE_DESTINATION)/chat
	@rm -rf $(PROTOC_CODE_DESTINATION)/google
	@mkdir -p $(PROTOC_CODE_DESTINATION)/google
	@protoc -Irocks/chat --js_out=import_style=commonjs,binary:$(PROTOC_CODE_DESTINATION)/chat socketEntities.proto chatEntities.proto chatting.proto period_chat.proto
	@protoc -Isrc/proto/google --js_out=import_style=commonjs,binary:$(PROTOC_CODE_DESTINATION)/google status.proto error_detail.proto

run:
	@node src/app.js