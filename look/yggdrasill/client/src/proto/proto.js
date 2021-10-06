/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/light");
$protobuf.util.Long = require('long');

var $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root()))
.addJSON({
  beanfun: {
    nested: {
      chat: {
        nested: {
          v1: {
            options: {
              go_package: "./;beanfun_chat_v1"
            },
            nested: {
              GraphicType: {
                values: {
                  GRAPHIC_TYPE_UNKNOWN: 0,
                  GRAPHIC_TYPE_A: 1,
                  GRAPHIC_TYPE_B: 2,
                  GRAPHIC_TYPE_C: 3,
                  GRAPHIC_TYPE_D: 4,
                  GRAPHIC_TYPE_E: 5,
                  GRAPHIC_TYPE_F: 6,
                  GRAPHIC_TYPE_G: 7
                }
              },
              OptionType: {
                values: {
                  OPTION_TYPE_UNKNOWN: 0,
                  OPTION_TYPE_WEB_PAGE: 1,
                  OPTION_TYPE_APP_LINK: 2,
                  OPTION_TYPE_H5_PAGE: 3,
                  OPTION_TYPE_EXTENSION_PAGE: 4,
                  OPTION_TYPE_POSTBACK: 5,
                  OPTION_TYPE_APP_LOG: 6
                }
              },
              ChatEventType: {
                values: {
                  CHAT_EVENT_TYPE_UNKNOWN: 0,
                  CHAT_EVENT_TYPE_CREATED: 1,
                  CHAT_EVENT_TYPE_UPDATED: 2,
                  CHAT_EVENT_TYPE_REMOVED: 3,
                  CHAT_EVENT_TYPE_DISMISSED: 4
                }
              },
              ChatStatus: {
                values: {
                  CHAT_STATUS_UNKNOWN: 0,
                  CHAT_STATUS_ACTIVE: 1,
                  CHAT_STATUS_INACTIVE: 2,
                  CHAT_STATUS_BLOCKED: 3
                }
              },
              PinnedMessageType: {
                values: {
                  PINNED_MESSAGE_TYPE_UNKNOWN: 0,
                  PINNED_MESSAGE_TYPE_ANNOUNCEMENT: 1,
                  PINNED_MESSAGE_TYPE_ACTIVITY: 2
                }
              },
              PinnedMessageEventType: {
                values: {
                  PINNED_MESSAGE_EVENT_TYPE_UNKNOWN: 0,
                  PINNED_MESSAGE_EVENT_TYPE_ADDED: 1,
                  PINNED_MESSAGE_EVENT_TYPE_REMOVED: 2,
                  PINNED_MESSAGE_EVENT_TYPE_SELF_REMOVED: 3
                }
              },
              UserPreferenceEventType: {
                values: {
                  USER_PREFERENCE_EVENT_TYPE_UNKNOWN: 0,
                  USER_PREFERENCE_EVENT_TYPE_MUTE_ADDED: 1,
                  USER_PREFERENCE_EVENT_TYPE_MUTE_REMOVED: 2,
                  USER_PREFERENCE_EVENT_TYPE_AD_BLOCK_ADDED: 3,
                  USER_PREFERENCE_EVENT_TYPE_AD_BLOCK_REMOVED: 4,
                  USER_PREFERENCE_EVENT_TYPE_PINNED_ADDED: 5,
                  USER_PREFERENCE_EVENT_TYPE_PINNED_REMOVED: 6
                }
              },
              ChatRole: {
                values: {
                  UNKNOWN_CHAT_ROLE: 0,
                  OWNER: 1,
                  MODERATOR: 2,
                  NORMAL_PARTICIPANT: 3
                }
              },
              ChatType: {
                values: {
                  UNKNOWN_CHAT_TYPE: 0,
                  GROUP: 1,
                  MATCHING: 2,
                  ASSISTANT: 3,
                  FUN_CHAT: 4,
                  GAME: 5,
                  PAIR: 6,
                  PERIOD: 7
                }
              },
              MessageEventType: {
                values: {
                  MESSAGE_EVENT_TYPE_UNKOWN: 0,
                  MESSAGE_EVENT_TYPE_RECALLED: 1,
                  MESSAGE_EVENT_TYPE_EXPIRED: 2,
                  MESSAGE_EVENT_TYPE_REMOVED: 3
                }
              },
              MimeType: {
                values: {
                  UNKNOWN_MIME_TYPE: 0,
                  TEXT_PLAIN: 1,
                  TEXT_CSV: 2,
                  TEXT_XML: 3,
                  TEXT_HTML: 4,
                  TEXT_RTF: 5,
                  IMAGE_PNG: 10,
                  IMAGE_JPEG: 11,
                  IMAGE_GIF: 12,
                  IMAGE_APNG: 13,
                  IMAGE_SVG: 14,
                  IMAGE_HEIC: 15,
                  IMAGE_HEIF: 16,
                  IMAGE_PSD: 17,
                  IMAGE_WMF: 18,
                  VIDEO_MPEG: 20,
                  VIDEO_MP4: 21,
                  VIDEO_OGG: 22,
                  VIDEO_QUICKTIME: 23,
                  VIDEO_WEBM: 24,
                  VIDEO_AVI: 25,
                  VIDEO_X_MS_WMV: 26,
                  VIDEO_X_FLV: 27,
                  AUDIO_MP4: 40,
                  AUDIO_MPEG: 41,
                  AUDIO_WAV: 42,
                  AUDIO_WEBM: 43,
                  AUDIO_M4A: 44,
                  APPLICATION_KEYNOTE: 56,
                  APPLICATION_NUMBERS: 57,
                  APPLICATION_PAGES: 58,
                  APPLICATION_POSTSCRIPT: 59,
                  APPLICATION_PDF: 60,
                  APPLICATION_ZIP: 61,
                  APPLICATION_MS_WORD: 62,
                  APPLICATION_OPENXML_DOCUMENT_WORD: 63,
                  APPLICATION_MS_POWERPOINT: 64,
                  APPLICATION_OPENXML_POWERPOINT: 65,
                  APPLICATION_MS_EXCEL: 66,
                  APPLICATION_OPENXML_SHEET_EXCEL: 67,
                  APPLICATION_DOCUMENT_MS_WORD: 68,
                  APPLICATION_TEMPLATE_MS_WORD: 69,
                  APPLICATION_OPENXML_TEMPLATE_WORD: 70,
                  APPLICATION_XPS_MS_WORD: 71,
                  APPLICATION_SHEET_MS_EXCEL: 72,
                  APPLICATION_TEMPLATE_MS_EXCEL: 73,
                  APPLICATION_OPENXML_TEMPLATE_EXCEL: 74,
                  APPLICATION_TEMPLATE_MS_POWERPOINT: 75,
                  APPLICATION_OPENXML_TEMPLATE_POWERPOINT: 76,
                  APPLICATION_MS_OFFICE_THEME_POWERPOINT: 77,
                  APPLICATION_7Z: 78,
                  APPLICATION_X_BEANFUN_TEXT: 80,
                  APPLICATION_X_BEANFUN_INTERACTIVE: 81,
                  APPLICATION_X_BEANFUN_POSTBACK: 82,
                  APPLICATION_X_BEANFUN_STICKERS: 83,
                  APPLICATION_X_BEANFUN_CALLING: 84,
                  APPLICATION_X_BEANFUN_LOCATION: 85,
                  APPLICATION_X_BEANFUN_CHEST: 86,
                  APPLICATION_X_BEANFUN_GRAPHIC: 87,
                  APPLICATION_X_BEANFUN_GIFT: 88,
                  APPLICATION_X_BEANFUN_STICKERS_COMBO: 89,
                  APPLICATION_X_BEANFUN_TEXT_CONTENT: 90,
                  APPLICATION_X_BEANFUN_ALBUM_CREATED: 100,
                  APPLICATION_X_BEANFUN_ALBUM_DELETED: 101,
                  APPLICATION_X_BEANFUN_ALBUM_RENAMED: 102,
                  APPLICATION_X_BEANFUN_PHOTOS_UPLOADED: 103,
                  APPLICATION_X_BEANFUN_PHOTOS_DELETED: 104,
                  APPLICATION_X_BEANFUN_MESSAGE_RECALLED: 105,
                  APPLICATION_X_BEANFUN_CHAT_ROLE_CHANGED: 106,
                  APPLICATION_X_BEANFUN_CHAT_LEFT: 107,
                  APPLICATION_X_BEANFUN_CHAT_UPDATED: 108,
                  APPLICATION_X_BEANFUN_CHAT_JOINED: 109,
                  APPLICATION_X_BEANFUN_CHAT_OWNER_CHANGED: 110
                }
              },
              PhotosOrderType: {
                values: {
                  PHOTOS_ORDER_TYPE_UNKNOWN: 0,
                  PHOTOS_ORDER_TYPE_UPLOAD_TIME: 1,
                  PHOTOS_ORDER_TYPE_PHOTO_TIME: 2
                }
              },
              FriendStatus: {
                values: {
                  FRIEND_STATUS_TYPE_UNKNOWN: 0,
                  FRIEND_STATUS_TYPE_INVITING: 1,
                  FRIEND_STATUS_TYPE_FRIEND: 2,
                  FRIEND_STATUS_TYPE_BLOCKED: 3
                }
              },
              FriendType: {
                values: {
                  FRIEND_TYPE_UNKNOWN: 0,
                  FRIEND_TYPE_PHONE: 1,
                  FRIEND_TYPE_EMAIL: 2,
                  FRIEND_TYPE_CUSTOM_ID: 3,
                  FRIEND_TYPE_QR_CODE: 4,
                  FRIEND_TYPE_NEAR_BY: 5,
                  FRIEND_TYPE_CONFIRM: 6,
                  FRIEND_TYPE_PROFILE: 7,
                  FRIEND_TYPE_APPLIED: 8
                }
              },
              NotificationEventType: {
                values: {
                  NOTIFICATION_EVENT_TYPE_UNKNOWN: 0,
                  NOTIFICATION_EVENT_TYPE_CHAT_MESSAGE: 1,
                  NOTIFICATION_EVENT_TYPE_CHAT_APPLICANTS_UPDATED: 2,
                  NOTIFICATION_EVENT_TYPE_CHAT_INVITATION_UPDATED: 3,
                  NOTIFICATION_EVENT_TYPE_ALBUM_CREATED: 4,
                  NOTIFICATION_EVENT_TYPE_ALBUM_UPDATED: 5,
                  NOTIFICATION_EVENT_TYPE_ALBUM_DELETED: 6,
                  NOTIFICATION_EVENT_TYPE_PHOTO_UPLOADED: 7,
                  NOTIFICATION_EVENT_TYPE_PHOTO_DELETED: 8,
                  NOTIFICATION_EVENT_TYPE_CALL_BF_NATIVE: 9,
                  NOTIFICATION_EVENT_TYPE_CHAT_WHISPER_MESSAGE: 10,
                  NOTIFICATION_EVENT_TYPE_CHAT_PERIOD_ON_AIR: 11
                }
              },
              SuspectReasonType: {
                values: {
                  SUSPECT_REASON_TYPE_UNKNOWN: 0,
                  SUSPECT_REASON_TYPE_ADVERTISE_ROBOT: 1,
                  SUSPECT_REASON_TYPE_NUDITY_OR_SEXUAL_ACTIVITY: 2,
                  SUSPECT_REASON_TYPE_SCAM_OR_FRAUD: 3,
                  SUSPECT_REASON_TYPE_CUSTOM_REASON: 4
                }
              },
              CallType: {
                values: {
                  CALL_TYPE_UNKNOWN: 0,
                  CALL_TYPE_P2P: 1,
                  CALL_TYPE_CONFERENCE_CALL: 2
                }
              },
              CallState: {
                values: {
                  CALL_STATE_UNKNOWN: 0,
                  CALL_STATE_CALL_ENDED: 1,
                  CALL_STATE_UNANSWERED: 2,
                  CALL_STATE_CANCELLED: 3,
                  CALL_STATE_CALL_BF_NATIVE: 4,
                  CALL_STATE_UNANSWERED_AND_NOT_ALLOW_VOICE_CALLS: 5,
                  CALL_STATE_CANCELLED_AND_NOT_ALLOW_VOICE_CALLS: 6,
                  CALL_STATE_REJECTED: 7
                }
              },
              LogLevel: {
                values: {
                  LOG_LEVEL_UNKNOWN: 0,
                  LOG_LEVEL_TRACE: 1,
                  LOG_LEVEL_DEBUG: 2,
                  LOG_LEVEL_INFO: 3,
                  LOG_LEVEL_WARN: 4,
                  LOG_LEVEL_ERROR: 5,
                  LOG_LEVEL_FATAL: 6
                }
              },
              AppLogScope: {
                values: {
                  APP_LOG_SCOPE_UNKNOWN: 0,
                  APP_LOG_SCOPE_CREATE_OR_LOGIN: 1,
                  APP_LOG_SCOPE_GAME_LOGIN: 2,
                  APP_LOG_SCOPE_GAMAPAY: 3,
                  APP_LOG_SCOPE_H5_LOGIN: 4
                }
              },
              TextContentType: {
                values: {
                  TEXT_CONTENT_TYPE_UNKNOWN: 0,
                  TEXT_CONTENT_TYPE_TEXT: 1,
                  TEXT_CONTENT_TYPE_MENTION: 2,
                  TEXT_CONTENT_TYPE_URI: 3,
                  TEXT_CONTENT_TYPE_PHONE: 4,
                  TEXT_CONTENT_TYPE_EMAIL: 5
                }
              },
              ReplyMessage: {
                fields: {
                  messageId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  senderId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  mimeType: {
                    type: "MimeType",
                    id: 3
                  },
                  senderNickname: {
                    type: "string",
                    id: 4
                  },
                  senderAvatar: {
                    type: "string",
                    id: 5
                  },
                  content: {
                    type: "string",
                    id: 6
                  },
                  metadata: {
                    type: "MimeTypeMetadata",
                    id: 8
                  }
                }
              },
              AlbumPhoto: {
                fields: {
                  id: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  width: {
                    type: "int32",
                    id: 2
                  },
                  height: {
                    type: "int32",
                    id: 3
                  },
                  uri: {
                    type: "string",
                    id: 4
                  },
                  thumbnailUri: {
                    type: "string",
                    id: 5
                  },
                  size: {
                    type: "int64",
                    id: 6,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              TextPlainMetadata: {
                fields: {
                  size: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              ImageMetadata: {
                fields: {
                  width: {
                    type: "int32",
                    id: 1
                  },
                  height: {
                    type: "int32",
                    id: 2
                  },
                  thumbnailUri: {
                    type: "string",
                    id: 3
                  },
                  size: {
                    type: "int64",
                    id: 4,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              VideoMetadata: {
                fields: {
                  width: {
                    type: "int32",
                    id: 1
                  },
                  height: {
                    type: "int32",
                    id: 2
                  },
                  thumbnailUri: {
                    type: "string",
                    id: 3
                  },
                  duration: {
                    type: "int32",
                    id: 4
                  },
                  size: {
                    type: "int64",
                    id: 5,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              AudioMetadata: {
                fields: {
                  duration: {
                    type: "int32",
                    id: 1
                  }
                }
              },
              FileMetadata: {
                fields: {
                  size: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              ApplicationXBeanfunTextMetadata: {
                fields: {
                  mention: {
                    rule: "repeated",
                    type: "AliasInfo",
                    id: 3
                  }
                }
              },
              ApplicationXBeanfunTextContentMetadata: {
                fields: {
                  items: {
                    rule: "repeated",
                    type: "ApplicationXBeanfunTextContentItem",
                    id: 1
                  }
                }
              },
              ApplicationXBeanfunTextContentItem: {
                fields: {
                  contentType: {
                    type: "TextContentType",
                    id: 1
                  },
                  metadata: {
                    type: "TextContentMetadata",
                    id: 2
                  }
                }
              },
              TextContentMetadata: {
                oneofs: {
                  metadataOneof: {
                    oneof: [
                      "text",
                      "mention",
                      "uri",
                      "phone",
                      "email"
                    ]
                  }
                },
                fields: {
                  text: {
                    type: "string",
                    id: 1
                  },
                  mention: {
                    type: "AliasInfo",
                    id: 2
                  },
                  uri: {
                    type: "URI",
                    id: 3
                  },
                  phone: {
                    type: "string",
                    id: 4
                  },
                  email: {
                    type: "string",
                    id: 5
                  }
                },
                nested: {
                  URI: {
                    fields: {
                      uri: {
                        type: "string",
                        id: 1
                      },
                      title: {
                        type: "string",
                        id: 2
                      },
                      description: {
                        type: "string",
                        id: 3
                      },
                      imageUri: {
                        type: "string",
                        id: 4
                      }
                    }
                  }
                }
              },
              AppLogInfo: {
                fields: {
                  level: {
                    type: "LogLevel",
                    id: 1
                  },
                  openConsole: {
                    type: "bool",
                    id: 2
                  },
                  scope: {
                    type: "AppLogScope",
                    id: 3
                  }
                }
              },
              Option: {
                fields: {
                  optKey: {
                    type: "string",
                    id: 1
                  },
                  optType: {
                    type: "OptionType",
                    id: 2
                  },
                  description: {
                    type: "string",
                    id: 3
                  },
                  uri: {
                    type: "string",
                    id: 4
                  },
                  tags: {
                    rule: "repeated",
                    type: "int32",
                    id: 5
                  },
                  proxyServiceId: {
                    type: "string",
                    id: 6
                  },
                  title: {
                    type: "string",
                    id: 7
                  },
                  postbackData: {
                    type: "string",
                    id: 8
                  },
                  appLogInfo: {
                    type: "AppLogInfo",
                    id: 9
                  }
                }
              },
              ApplicationXBeanfunInteractiveMetadata: {
                fields: {
                  serviceId: {
                    type: "string",
                    id: 2
                  },
                  imageInfo: {
                    type: "ImageInfo",
                    id: 3
                  },
                  forwardable: {
                    type: "bool",
                    id: 4
                  },
                  once: {
                    type: "bool",
                    id: 5
                  },
                  expiredHint: {
                    type: "string",
                    id: 7
                  },
                  options: {
                    rule: "repeated",
                    type: "Option",
                    id: 8
                  },
                  interactiveKey: {
                    type: "string",
                    id: 11
                  },
                  messageTrackId: {
                    type: "int64",
                    id: 12,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  sessionId: {
                    type: "string",
                    id: 13
                  },
                  title: {
                    type: "string",
                    id: 14
                  }
                }
              },
              ApplicationXBeanfunGraphicMetadata: {
                fields: {
                  serviceId: {
                    type: "string",
                    id: 2
                  },
                  imageInfo: {
                    type: "ImageInfo",
                    id: 3
                  },
                  graphicType: {
                    type: "GraphicType",
                    id: 7
                  },
                  options: {
                    rule: "repeated",
                    type: "Option",
                    id: 8
                  },
                  interactiveKey: {
                    type: "string",
                    id: 11
                  },
                  messageTrackId: {
                    type: "int64",
                    id: 12,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              ApplicationXBeanfunGiftMetadata: {
                fields: {
                  linkUri: {
                    type: "string",
                    id: 2
                  },
                  linkDescription: {
                    type: "string",
                    id: 3
                  },
                  imageType: {
                    type: "MimeType",
                    id: 4
                  },
                  imageUri: {
                    type: "string",
                    id: 5
                  }
                }
              },
              ApplicationXBeanfunPostbackMetadata: {
                fields: {
                  parentMessageId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  selectedOptionKey: {
                    type: "string",
                    id: 2
                  },
                  convertedPostbackData: {
                    type: "string",
                    id: 3
                  }
                }
              },
              ImageInfo: {
                fields: {
                  mimeType: {
                    type: "MimeType",
                    id: 1
                  },
                  uri: {
                    type: "string",
                    id: 2
                  },
                  thumbnailUri: {
                    type: "string",
                    id: 3
                  }
                }
              },
              ApplicationXBeanfunChestMetadata: {
                fields: {
                  title: {
                    type: "string",
                    id: 1
                  },
                  expiredHint: {
                    type: "string",
                    id: 4
                  },
                  coverImageInfo: {
                    type: "ImageInfo",
                    id: 6
                  },
                  sealedImageInfo: {
                    type: "ImageInfo",
                    id: 7
                  },
                  unsealedImageInfo: {
                    type: "ImageInfo",
                    id: 8
                  },
                  description: {
                    type: "string",
                    id: 9
                  },
                  pageTitle: {
                    type: "string",
                    id: 10
                  },
                  pageUri: {
                    type: "string",
                    id: 11
                  },
                  messageTrackId: {
                    type: "int64",
                    id: 12,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              Sticker: {
                fields: {
                  stickerPkgId: {
                    type: "string",
                    id: 1
                  },
                  stickerId: {
                    type: "string",
                    id: 2
                  },
                  stickerFormat: {
                    type: "string",
                    id: 3
                  },
                  stickerSrcUri: {
                    type: "string",
                    id: 4
                  },
                  stickerHdUri: {
                    type: "string",
                    id: 5
                  },
                  stickerThumbUri: {
                    type: "string",
                    id: 6
                  },
                  width: {
                    type: "int32",
                    id: 7
                  },
                  height: {
                    type: "int32",
                    id: 8
                  }
                }
              },
              ApplicationXBeanfunStickersMetadata: {
                fields: {
                  sticker: {
                    type: "Sticker",
                    id: 1
                  }
                }
              },
              ApplicationXBeanfunStickersComboMetadata: {
                fields: {
                  stickers: {
                    rule: "repeated",
                    type: "Sticker",
                    id: 1
                  },
                  comboId: {
                    type: "string",
                    id: 2
                  },
                  title: {
                    type: "string",
                    id: 3
                  },
                  width: {
                    type: "int32",
                    id: 4
                  },
                  height: {
                    type: "int32",
                    id: 5
                  },
                  imageUri: {
                    type: "string",
                    id: 6
                  }
                }
              },
              ApplicationXBeanfunCallingMetadata: {
                fields: {
                  callType: {
                    type: "CallType",
                    id: 1
                  },
                  callState: {
                    type: "CallState",
                    id: 2
                  },
                  callerNickname: {
                    type: "string",
                    id: 3
                  },
                  duration: {
                    type: "int32",
                    id: 4
                  }
                }
              },
              ApplicationXBeanfunLocationMetadata: {
                fields: {
                  longitude: {
                    type: "double",
                    id: 1
                  },
                  latitude: {
                    type: "double",
                    id: 2
                  }
                }
              },
              ApplicationXBeanfunAlbumCreatedMetadata: {
                fields: {
                  albumId: {
                    type: "int32",
                    id: 1
                  },
                  albumName: {
                    type: "string",
                    id: 2
                  }
                }
              },
              ApplicationXBeanfunAlbumDeletedMetadata: {
                fields: {
                  albumId: {
                    type: "int32",
                    id: 1
                  },
                  albumName: {
                    type: "string",
                    id: 2
                  }
                }
              },
              ApplicationXBeanfunAlbumRenamedMetadata: {
                fields: {
                  albumId: {
                    type: "int32",
                    id: 1
                  },
                  albumName: {
                    type: "string",
                    id: 2
                  }
                }
              },
              ApplicationXBeanfunPhotosUploadedMetadata: {
                fields: {
                  albumId: {
                    type: "int32",
                    id: 1
                  },
                  albumName: {
                    type: "string",
                    id: 2
                  },
                  thumbnailUri: {
                    type: "string",
                    id: 3
                  },
                  photosAmount: {
                    type: "int32",
                    id: 4
                  }
                }
              },
              ApplicationXBeanfunPhotosDeletedMetadata: {
                fields: {
                  albumId: {
                    type: "int32",
                    id: 1
                  },
                  albumName: {
                    type: "string",
                    id: 2
                  },
                  photosAmount: {
                    type: "int32",
                    id: 4
                  }
                }
              },
              ApplicationXBeanfunMessageRecalledMetadata: {
                fields: {
                  recaller: {
                    type: "AliasInfo",
                    id: 1
                  }
                }
              },
              ApplicationXBeanfunChatLeftMetadata: {
                fields: {
                  alias: {
                    type: "AliasInfo",
                    id: 3
                  }
                }
              },
              ApplicationXBeanfunChatJoinedMetadata: {
                fields: {
                  aliases: {
                    rule: "repeated",
                    type: "AliasInfo",
                    id: 2
                  }
                }
              },
              ApplicationXBeanfunChatRoleChangedMetadata: {
                fields: {
                  moderators: {
                    rule: "repeated",
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  normal: {
                    rule: "repeated",
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              ApplicationXBeanfunChatOwnerChangedMetadata: {
                fields: {
                  owner: {
                    type: "AliasInfo",
                    id: 1
                  }
                }
              },
              MimeTypeMetadata: {
                oneofs: {
                  metadataOneof: {
                    oneof: [
                      "textPlainMetadata",
                      "imageMetadata",
                      "videoMetadata",
                      "audioMetadata",
                      "fileMetadata",
                      "applicationXBeanfunTextMetadata",
                      "applicationXBeanfunInteractiveMetadata",
                      "applicationXBeanfunPostbackMetadata",
                      "applicationXBeanfunStickersMetadata",
                      "applicationXBeanfunCallingMetadata",
                      "applicationXBeanfunLocationMetadata",
                      "applicationXBeanfunChestMetadata",
                      "applicationXBeanfunGraphicMetadata",
                      "applicationXBeanfunGiftMetadata",
                      "applicationXBeanfunStickersComboMetadata",
                      "applicationXBeanfunTextContentMetadata",
                      "applicationXBeanfunAlbumCreatedMetadata",
                      "applicationXBeanfunAlbumDeletedMetadata",
                      "applicationXBeanfunAlbumRenamedMetadata",
                      "applicationXBeanfunPhotosUploadedMetadata",
                      "applicationXBeanfunPhotosDeletedMetadata",
                      "applicationXBeanfunMessageRecalledMetadata",
                      "applicationXBeanfunChatRoleChangedMetadata",
                      "applicationXBeanfunChatLeftMetadata",
                      "applicationXBeanfunChatJoinedMetadata",
                      "applicationXBeanfunChatOwnerChangedMetadata"
                    ]
                  }
                },
                fields: {
                  textPlainMetadata: {
                    type: "TextPlainMetadata",
                    id: 1
                  },
                  imageMetadata: {
                    type: "ImageMetadata",
                    id: 10
                  },
                  videoMetadata: {
                    type: "VideoMetadata",
                    id: 20
                  },
                  audioMetadata: {
                    type: "AudioMetadata",
                    id: 30
                  },
                  fileMetadata: {
                    type: "FileMetadata",
                    id: 60
                  },
                  applicationXBeanfunTextMetadata: {
                    type: "ApplicationXBeanfunTextMetadata",
                    id: 80
                  },
                  applicationXBeanfunInteractiveMetadata: {
                    type: "ApplicationXBeanfunInteractiveMetadata",
                    id: 81
                  },
                  applicationXBeanfunPostbackMetadata: {
                    type: "ApplicationXBeanfunPostbackMetadata",
                    id: 82
                  },
                  applicationXBeanfunStickersMetadata: {
                    type: "ApplicationXBeanfunStickersMetadata",
                    id: 83
                  },
                  applicationXBeanfunCallingMetadata: {
                    type: "ApplicationXBeanfunCallingMetadata",
                    id: 84
                  },
                  applicationXBeanfunLocationMetadata: {
                    type: "ApplicationXBeanfunLocationMetadata",
                    id: 85
                  },
                  applicationXBeanfunChestMetadata: {
                    type: "ApplicationXBeanfunChestMetadata",
                    id: 86
                  },
                  applicationXBeanfunGraphicMetadata: {
                    type: "ApplicationXBeanfunGraphicMetadata",
                    id: 87
                  },
                  applicationXBeanfunGiftMetadata: {
                    type: "ApplicationXBeanfunGiftMetadata",
                    id: 88
                  },
                  applicationXBeanfunStickersComboMetadata: {
                    type: "ApplicationXBeanfunStickersComboMetadata",
                    id: 89
                  },
                  applicationXBeanfunTextContentMetadata: {
                    type: "ApplicationXBeanfunTextContentMetadata",
                    id: 90
                  },
                  applicationXBeanfunAlbumCreatedMetadata: {
                    type: "ApplicationXBeanfunAlbumCreatedMetadata",
                    id: 100
                  },
                  applicationXBeanfunAlbumDeletedMetadata: {
                    type: "ApplicationXBeanfunAlbumDeletedMetadata",
                    id: 101
                  },
                  applicationXBeanfunAlbumRenamedMetadata: {
                    type: "ApplicationXBeanfunAlbumRenamedMetadata",
                    id: 102
                  },
                  applicationXBeanfunPhotosUploadedMetadata: {
                    type: "ApplicationXBeanfunPhotosUploadedMetadata",
                    id: 103
                  },
                  applicationXBeanfunPhotosDeletedMetadata: {
                    type: "ApplicationXBeanfunPhotosDeletedMetadata",
                    id: 104
                  },
                  applicationXBeanfunMessageRecalledMetadata: {
                    type: "ApplicationXBeanfunMessageRecalledMetadata",
                    id: 105
                  },
                  applicationXBeanfunChatRoleChangedMetadata: {
                    type: "ApplicationXBeanfunChatRoleChangedMetadata",
                    id: 106
                  },
                  applicationXBeanfunChatLeftMetadata: {
                    type: "ApplicationXBeanfunChatLeftMetadata",
                    id: 107
                  },
                  applicationXBeanfunChatJoinedMetadata: {
                    type: "ApplicationXBeanfunChatJoinedMetadata",
                    id: 109
                  },
                  applicationXBeanfunChatOwnerChangedMetadata: {
                    type: "ApplicationXBeanfunChatOwnerChangedMetadata",
                    id: 110
                  }
                }
              },
              Snapshot: {
                fields: {
                  snapshotItems: {
                    rule: "repeated",
                    type: "SnapshotItem",
                    id: 1
                  }
                }
              },
              SnapshotItem: {
                fields: {
                  mentioned: {
                    type: "bool",
                    id: 4
                  },
                  scheduled: {
                    type: "bool",
                    id: 5
                  },
                  chatId: {
                    type: "int64",
                    id: 6,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  participantsCount: {
                    type: "int32",
                    id: 8
                  },
                  unreadCount: {
                    type: "int32",
                    id: 9
                  },
                  chatType: {
                    type: "ChatType",
                    id: 10
                  },
                  chatRole: {
                    type: "ChatRole",
                    id: 11
                  },
                  pinned: {
                    type: "bool",
                    id: 12
                  },
                  muted: {
                    type: "bool",
                    id: 13
                  },
                  haveApplicants: {
                    type: "bool",
                    id: 14
                  },
                  haveSuspects: {
                    type: "bool",
                    id: 15
                  },
                  gameName: {
                    type: "string",
                    id: 16
                  },
                  chatSubject: {
                    type: "string",
                    id: 17
                  },
                  chatPhotoUri: {
                    type: "string",
                    id: 18
                  },
                  senderId: {
                    type: "int64",
                    id: 19,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  hidden: {
                    type: "bool",
                    id: 20
                  },
                  targetId: {
                    type: "int64",
                    id: 22,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  lastMessage: {
                    type: "ChatMessage",
                    id: 23
                  },
                  invited: {
                    type: "bool",
                    id: 24
                  },
                  inviter: {
                    type: "int64",
                    id: 25,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  joinedTime: {
                    type: "int64",
                    id: 26,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  invitedTime: {
                    type: "int64",
                    id: 27,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  haveWhispers: {
                    type: "bool",
                    id: 28
                  },
                  aliasId: {
                    type: "int64",
                    id: 29,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  isOfficial: {
                    type: "bool",
                    id: 30
                  },
                  startTime: {
                    type: "int64",
                    id: 31
                  }
                }
              },
              RawMessage: {
                fields: {
                  mimeType: {
                    type: "MimeType",
                    id: 1
                  },
                  content: {
                    type: "string",
                    id: 2
                  },
                  displayFull: {
                    type: "bool",
                    id: 3
                  },
                  metadata: {
                    type: "MimeTypeMetadata",
                    id: 4
                  },
                  ttl: {
                    type: "int32",
                    id: 5
                  },
                  expiredTime: {
                    type: "int64",
                    id: 6,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              AssistantSearch: {
                fields: {
                  openId: {
                    type: "string",
                    id: 1
                  },
                  serviceId: {
                    type: "string",
                    id: 2
                  }
                }
              },
              PairSearch: {
                fields: {
                  targetId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              DemandMessage: {
                oneofs: {
                  whichChatOneof: {
                    oneof: [
                      "chatId",
                      "chatExtId",
                      "assistantSearch",
                      "pairSearch"
                    ]
                  },
                  whichSenderOneof: {
                    oneof: [
                      "senderId",
                      "serviceId"
                    ]
                  }
                },
                fields: {
                  chatId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  chatExtId: {
                    type: "string",
                    id: 2
                  },
                  assistantSearch: {
                    type: "AssistantSearch",
                    id: 8
                  },
                  pairSearch: {
                    type: "PairSearch",
                    id: 10
                  },
                  senderId: {
                    type: "int64",
                    id: 3,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  serviceId: {
                    type: "string",
                    id: 9
                  },
                  rawMessage: {
                    type: "RawMessage",
                    id: 4
                  },
                  replyMessage: {
                    type: "ReplyMessage",
                    id: 5
                  }
                }
              },
              ChatMessage: {
                fields: {
                  mimeType: {
                    type: "MimeType",
                    id: 1
                  },
                  messageId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  chatId: {
                    type: "int64",
                    id: 3,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  content: {
                    type: "string",
                    id: 4
                  },
                  senderId: {
                    type: "int64",
                    id: 6,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  metadata: {
                    type: "MimeTypeMetadata",
                    id: 7
                  },
                  replyMessage: {
                    type: "ReplyMessage",
                    id: 8
                  },
                  ttl: {
                    type: "int32",
                    id: 9
                  },
                  messageTime: {
                    type: "int64",
                    id: 10,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  expiredTime: {
                    type: "int64",
                    id: 11,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  displayFull: {
                    type: "bool",
                    id: 12
                  }
                }
              },
              ChatMessageV2: {
                fields: {
                  chatId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  senderId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  rawMessage: {
                    type: "RawMessage",
                    id: 3
                  },
                  replyMessage: {
                    type: "ReplyMessage",
                    id: 4
                  },
                  messageId: {
                    type: "int64",
                    id: 5,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  messageTime: {
                    type: "int64",
                    id: 6,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  displayFull: {
                    type: "bool",
                    id: 12
                  }
                }
              },
              KafkaSendMessagePayload: {
                fields: {
                  ticketId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  serviceId: {
                    type: "string",
                    id: 2
                  },
                  message: {
                    type: "DemandMessage",
                    id: 3
                  },
                  device: {
                    type: "string",
                    id: 4
                  },
                  isAd: {
                    type: "bool",
                    id: 5
                  }
                }
              },
              KafkaReadMessagePayload: {
                fields: {
                  aliasId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  chatId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  messageId: {
                    type: "int64",
                    id: 3,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              KafkaProcessMessagePayload: {
                fields: {
                  message: {
                    type: "ChatMessage",
                    id: 1
                  },
                  eventType: {
                    type: "NotificationEventType",
                    id: 2
                  },
                  targetId: {
                    type: "int64",
                    id: 3
                  },
                  isBlocked: {
                    type: "bool",
                    id: 4
                  }
                }
              },
              UserChat: {
                fields: {
                  chatId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  type: {
                    type: "ChatType",
                    id: 2
                  },
                  subject: {
                    type: "string",
                    id: 3
                  },
                  description: {
                    type: "string",
                    id: 4
                  },
                  photoUri: {
                    type: "string",
                    id: 5
                  },
                  coverPhotoUri: {
                    type: "string",
                    id: 6
                  },
                  inviteLink: {
                    type: "string",
                    id: 7
                  },
                  ownerId: {
                    type: "int64",
                    id: 8,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  setting: {
                    type: "ChatSetting",
                    id: 9
                  },
                  gameInfo: {
                    type: "GameInfo",
                    id: 10
                  },
                  metadata: {
                    type: "ChatMetaData",
                    id: 11
                  },
                  moderators: {
                    rule: "repeated",
                    type: "int64",
                    id: 12,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  userPreference: {
                    type: "UserChatPreference",
                    id: 13
                  },
                  hasApplicants: {
                    type: "bool",
                    id: 14
                  },
                  hasSuspects: {
                    type: "bool",
                    id: 15,
                    options: {
                      deprecated: true
                    }
                  },
                  participantsCount: {
                    type: "int32",
                    id: 16
                  },
                  modifiedTime: {
                    type: "int64",
                    id: 17,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  tags: {
                    rule: "repeated",
                    type: "int32",
                    id: 18
                  },
                  participantsLimit: {
                    type: "int32",
                    id: 19
                  },
                  inviterId: {
                    type: "int64",
                    id: 20,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  invitedTime: {
                    type: "int64",
                    id: 21,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  serviceProfile: {
                    type: "ServiceProfile",
                    id: 22
                  },
                  announceContent: {
                    type: "string",
                    id: 23,
                    options: {
                      deprecated: true
                    }
                  },
                  announceURI: {
                    type: "string",
                    id: 24,
                    options: {
                      deprecated: true
                    }
                  },
                  streamURI: {
                    type: "string",
                    id: 25
                  },
                  streamWidth: {
                    type: "int32",
                    id: 26
                  },
                  streamHeight: {
                    type: "int32",
                    id: 27
                  },
                  isOfficial: {
                    type: "bool",
                    id: 28
                  },
                  status: {
                    type: "ChatStatus",
                    id: 29
                  }
                }
              },
              ChatSetting: {
                fields: {
                  announcePermit: {
                    type: "ChatRole",
                    id: 1,
                    options: {
                      deprecated: true
                    }
                  },
                  invitePermit: {
                    type: "ChatRole",
                    id: 2
                  },
                  streamPermit: {
                    type: "ChatRole",
                    id: 3
                  },
                  judgePermit: {
                    type: "ChatRole",
                    id: 4
                  },
                  pinPermit: {
                    type: "ChatRole",
                    id: 5
                  }
                }
              },
              ServiceProfile: {
                fields: {
                  serviceId: {
                    type: "string",
                    id: 1
                  }
                }
              },
              ChatProfile: {
                fields: {
                  chatId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  type: {
                    type: "ChatType",
                    id: 2
                  },
                  subject: {
                    type: "string",
                    id: 3
                  },
                  description: {
                    type: "string",
                    id: 4
                  },
                  photoUri: {
                    type: "string",
                    id: 5
                  },
                  coverPhotoUri: {
                    type: "string",
                    id: 6
                  },
                  inviteLink: {
                    type: "string",
                    id: 7
                  },
                  ownerId: {
                    type: "int64",
                    id: 8,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  gameInfo: {
                    type: "GameInfo",
                    id: 10
                  },
                  metadata: {
                    type: "ChatProfileMetaData",
                    id: 11
                  },
                  participantsCount: {
                    type: "int32",
                    id: 12
                  },
                  tags: {
                    rule: "repeated",
                    type: "int32",
                    id: 13
                  },
                  participantsLimit: {
                    type: "int32",
                    id: 15
                  },
                  isOfficial: {
                    type: "bool",
                    id: 16
                  },
                  status: {
                    type: "ChatStatus",
                    id: 17
                  },
                  isParticipant: {
                    type: "bool",
                    id: 18
                  }
                }
              },
              GameInfo: {
                fields: {
                  id: {
                    type: "string",
                    id: 1
                  },
                  name: {
                    type: "string",
                    id: 2
                  }
                }
              },
              ChatMetaData: {
                fields: {
                  targetId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  latitude: {
                    type: "google.protobuf.DoubleValue",
                    id: 2
                  },
                  longitude: {
                    type: "google.protobuf.DoubleValue",
                    id: 3
                  },
                  restricted: {
                    type: "bool",
                    id: 4
                  },
                  seeHistory: {
                    type: "bool",
                    id: 5
                  },
                  applyQuestions: {
                    type: "bool",
                    id: 7
                  },
                  questions: {
                    rule: "repeated",
                    type: "string",
                    id: 8
                  },
                  adminApproval: {
                    type: "bool",
                    id: 9
                  },
                  startTime: {
                    type: "int64",
                    id: 10,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  endTime: {
                    type: "int64",
                    id: 11,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  speakerIds: {
                    rule: "repeated",
                    type: "int64",
                    id: 12,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              ChatProfileMetaData: {
                fields: {
                  questions: {
                    rule: "repeated",
                    type: "string",
                    id: 1
                  },
                  latitude: {
                    type: "google.protobuf.DoubleValue",
                    id: 2
                  },
                  longitude: {
                    type: "google.protobuf.DoubleValue",
                    id: 3
                  },
                  applyQuestions: {
                    type: "bool",
                    id: 4
                  },
                  adminApproval: {
                    type: "bool",
                    id: 5
                  },
                  restricted: {
                    type: "bool",
                    id: 6
                  },
                  startTime: {
                    type: "int64",
                    id: 7,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  endTime: {
                    type: "int64",
                    id: 8,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  speakerIds: {
                    rule: "repeated",
                    type: "int64",
                    id: 9,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  subscribedCount: {
                    type: "int32",
                    id: 10
                  },
                  isSubscribed: {
                    type: "bool",
                    id: 11
                  }
                }
              },
              UserChatPreference: {
                fields: {
                  role: {
                    type: "ChatRole",
                    id: 1
                  },
                  pinned: {
                    type: "bool",
                    id: 2
                  },
                  mute: {
                    type: "bool",
                    id: 3
                  },
                  adBlock: {
                    type: "bool",
                    id: 4
                  },
                  aliasId: {
                    type: "int64",
                    id: 5,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  favorite: {
                    type: "bool",
                    id: 6
                  },
                  joinedTime: {
                    type: "int64",
                    id: 7,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  hasSuspects: {
                    type: "bool",
                    id: 8
                  }
                }
              },
              MessageEvent: {
                fields: {
                  messageEventItems: {
                    rule: "repeated",
                    type: "MessageEventItem",
                    id: 1
                  }
                }
              },
              MessageEventItem: {
                fields: {
                  messageEventType: {
                    type: "MessageEventType",
                    id: 1
                  },
                  messageId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  message: {
                    type: "ChatMessage",
                    id: 3
                  },
                  chatId: {
                    type: "int64",
                    id: 4,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  eventCreatedTime: {
                    type: "int64",
                    id: 5,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              PinnedMessageEvent: {
                fields: {
                  pinnedMessageEventItems: {
                    rule: "repeated",
                    type: "PinnedMessageEventItem",
                    id: 1
                  }
                }
              },
              PinnedMessageEventItem: {
                fields: {
                  pinnedMessageEventType: {
                    type: "PinnedMessageEventType",
                    id: 1
                  },
                  pinnedMessageType: {
                    type: "PinnedMessageType",
                    id: 2
                  },
                  message: {
                    type: "ChatMessage",
                    id: 3
                  },
                  messageId: {
                    type: "int64",
                    id: 4,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  chatId: {
                    type: "int64",
                    id: 5,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  eventCreatedTime: {
                    type: "int64",
                    id: 6,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  senderId: {
                    type: "int64",
                    id: 7,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              ChatEvent: {
                fields: {
                  chatEventItems: {
                    rule: "repeated",
                    type: "ChatEventItem",
                    id: 1
                  }
                }
              },
              ChatEventItem: {
                fields: {
                  userChat: {
                    type: "UserChat",
                    id: 1
                  },
                  chatId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  eventCreatedTime: {
                    type: "int64",
                    id: 3,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  chatEventType: {
                    type: "ChatEventType",
                    id: 4
                  }
                }
              },
              UserPreferenceEvent: {
                fields: {
                  userId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  chatId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  eventCreatedTime: {
                    type: "int64",
                    id: 3,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              UserEvent: {
                fields: {
                  aliasId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  nickname: {
                    type: "string",
                    id: 2
                  },
                  avatar: {
                    type: "string",
                    id: 3
                  },
                  email: {
                    type: "string",
                    id: 4
                  },
                  hashedWholePhone: {
                    type: "string",
                    id: 5
                  },
                  customNickname: {
                    type: "string",
                    id: 6
                  },
                  phoneCountryCode: {
                    type: "string",
                    id: 7
                  }
                }
              },
              AliasInfo: {
                fields: {
                  id: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  nickname: {
                    type: "string",
                    id: 2
                  }
                }
              },
              FriendEvent: {
                fields: {
                  aliasId: {
                    type: "int64",
                    id: 1
                  },
                  nickname: {
                    type: "string",
                    id: 2
                  },
                  avatar: {
                    type: "string",
                    id: 3
                  },
                  email: {
                    type: "string",
                    id: 4
                  },
                  hashedPhone: {
                    type: "string",
                    id: 5
                  },
                  friendStatus: {
                    type: "FriendStatus",
                    id: 6
                  },
                  friendType: {
                    type: "FriendType",
                    id: 7
                  },
                  hashedEmail: {
                    type: "string",
                    id: 8
                  },
                  beFriendTime: {
                    type: "int64",
                    id: 9
                  },
                  mutualFriendCount: {
                    type: "int32",
                    id: 10
                  },
                  phoneCountryCode: {
                    type: "string",
                    id: 11
                  }
                }
              },
              AddScheduleMessageEvent: {
                fields: {
                  chatId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  senderId: {
                    type: "int64",
                    id: 3,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  scheduleId: {
                    type: "int32",
                    id: 4
                  },
                  message: {
                    type: "RawMessage",
                    id: 5
                  },
                  replyMessage: {
                    type: "ReplyMessage",
                    id: 6
                  },
                  scheduleTime: {
                    type: "int64",
                    id: 7,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  eventCreatedTime: {
                    type: "int64",
                    id: 8,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              DeleteScheduleMessageEvent: {
                fields: {
                  chatId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  senderId: {
                    type: "int64",
                    id: 3,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  scheduleIds: {
                    rule: "repeated",
                    type: "int32",
                    id: 4
                  },
                  eventCreatedTime: {
                    type: "int64",
                    id: 5,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              UnlockWhisperMessageEvent: {
                fields: {
                  chatId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  userId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  whisperMessages: {
                    rule: "repeated",
                    type: "WhisperMessage",
                    id: 3
                  }
                }
              },
              WhisperMessage: {
                fields: {
                  messageId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  expiredTime: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              NotificationPayload: {
                oneofs: {
                  toOneof: {
                    oneof: [
                      "toOpenId",
                      "toAliasId",
                      "toAll"
                    ]
                  },
                  fromOneof: {
                    oneof: [
                      "fromServiceId",
                      "fromAliasId"
                    ]
                  }
                },
                fields: {
                  category: {
                    type: "string",
                    id: 1
                  },
                  subcategory: {
                    type: "string",
                    id: 2
                  },
                  toOpenId: {
                    type: "string",
                    id: 3
                  },
                  toAliasId: {
                    type: "int64",
                    id: 4,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  toAll: {
                    type: "bool",
                    id: 5
                  },
                  title: {
                    type: "string",
                    id: 6
                  },
                  subtitle: {
                    type: "string",
                    id: 7
                  },
                  body: {
                    type: "string",
                    id: 8
                  },
                  customData: {
                    type: "string",
                    id: 9
                  },
                  appLink: {
                    type: "string",
                    id: 10
                  },
                  fromServiceId: {
                    type: "string",
                    id: 11
                  },
                  fromAliasId: {
                    type: "int64",
                    id: 12,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              Notification: {
                fields: {
                  id: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  payload: {
                    type: "NotificationPayload",
                    id: 2
                  },
                  createdTime: {
                    type: "int64",
                    id: 3,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              AddNotificationEvent: {
                fields: {
                  notification: {
                    type: "Notification",
                    id: 1
                  }
                }
              },
              JollyBuyEvent: {
                fields: {
                  createdTime: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              StringableInt64Value: {
                fields: {
                  value: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              LogoutEvent: {
                fields: {
                  aliasId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  newToken: {
                    type: "string",
                    id: 2
                  }
                }
              },
              AliasDeletedEvent: {
                fields: {
                  deletedAliasID: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              LoginPacket: {
                fields: {
                  token: {
                    type: "string",
                    id: 1
                  },
                  device: {
                    type: "string",
                    id: 2
                  },
                  userAgent: {
                    type: "string",
                    id: 3
                  }
                }
              },
              LoginAck: {
                oneofs: {
                  ackOneof: {
                    oneof: [
                      "sessionId",
                      "socketError"
                    ]
                  }
                },
                fields: {
                  sessionId: {
                    type: "string",
                    id: 1
                  },
                  socketError: {
                    type: "SocketError",
                    id: 2
                  }
                }
              },
              InitAck: {
                fields: {
                  systemUnavailable: {
                    type: "bool",
                    id: 1
                  },
                  unavailableHint: {
                    type: "string",
                    id: 2
                  },
                  chatsLastUpdated: {
                    type: "int64",
                    id: 4,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  usersLastUpdated: {
                    type: "int64",
                    id: 5,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  userSubscriptionsLastUpdated: {
                    type: "int64",
                    id: 7,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  missionsLastUpdated: {
                    type: "int64",
                    id: 8,
                    options: {
                      jstype: "JS_STRING",
                      deprecated: true
                    }
                  },
                  promotionsLastUpdated: {
                    type: "int64",
                    id: 9,
                    options: {
                      jstype: "JS_STRING",
                      deprecated: true
                    }
                  },
                  notificationsLastUpdated: {
                    type: "int64",
                    id: 10,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  assetPointLastUpdated: {
                    type: "int64",
                    id: 11,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  assetTreasureLastUpdated: {
                    type: "int64",
                    id: 12,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  assetBoxLastUpdated: {
                    type: "int64",
                    id: 13,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  assetBonusLastUpdated: {
                    type: "int64",
                    id: 14,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  assetTicketLastUpdated: {
                    type: "int64",
                    id: 15,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  assetCardLastUpdated: {
                    type: "int64",
                    id: 16,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  jollybuyLastUpdated: {
                    type: "int64",
                    id: 17,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  assetTradeCenterLastUpdated: {
                    type: "int64",
                    id: 18,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  assetTradeCenterHistoryLastUpdated: {
                    type: "int64",
                    id: 19,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              SendMessagePacket: {
                fields: {
                  mimeType: {
                    type: "MimeType",
                    id: 1
                  },
                  chatId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  content: {
                    type: "string",
                    id: 3
                  },
                  metadata: {
                    type: "MimeTypeMetadata",
                    id: 5
                  },
                  senderId: {
                    type: "int64",
                    id: 6,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  replyMessage: {
                    type: "ReplyMessage",
                    id: 7
                  },
                  ttl: {
                    type: "int32",
                    id: 8
                  },
                  requestId: {
                    type: "string",
                    id: 9
                  },
                  expiredTime: {
                    type: "int64",
                    id: 10,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              SendMessageAck: {
                oneofs: {
                  ackOneof: {
                    oneof: [
                      "message",
                      "socketError"
                    ]
                  }
                },
                fields: {
                  message: {
                    type: "ChatMessage",
                    id: 1
                  },
                  socketError: {
                    type: "SocketError",
                    id: 2
                  }
                }
              },
              ScheduleMessagePacket: {
                fields: {
                  chatId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  senderId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  rawMessage: {
                    type: "RawMessage",
                    id: 3
                  },
                  replyMessage: {
                    type: "ReplyMessage",
                    id: 4
                  },
                  requestId: {
                    type: "int64",
                    id: 5,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  scheduleTime: {
                    type: "int64",
                    id: 6,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              ScheduleMessageAck: {
                fields: {
                  scheduleId: {
                    type: "int32",
                    id: 1
                  },
                  socketError: {
                    type: "SocketError",
                    id: 2
                  }
                }
              },
              ForwardMessagesPacket: {
                fields: {
                  chatIds: {
                    rule: "repeated",
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  senderIds: {
                    rule: "repeated",
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  rawMessages: {
                    rule: "repeated",
                    type: "RawMessage",
                    id: 3
                  }
                }
              },
              ForwardMessagesAck: {
                fields: {
                  messages: {
                    rule: "repeated",
                    type: "ChatMessage",
                    id: 1
                  },
                  failedChatIds: {
                    rule: "repeated",
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  socketError: {
                    type: "SocketError",
                    id: 3
                  }
                }
              },
              SendMessageV2Packet: {
                fields: {
                  chatId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  senderId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  rawMessage: {
                    type: "RawMessage",
                    id: 3
                  },
                  replyMessage: {
                    type: "ReplyMessage",
                    id: 4
                  },
                  requestId: {
                    type: "int64",
                    id: 5,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              EnterChatPacket: {
                fields: {
                  chatId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  lastMessageId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  userId: {
                    type: "int64",
                    id: 3,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              EnterChatAck: {
                fields: {
                  messages: {
                    rule: "repeated",
                    type: "ChatMessage",
                    id: 1
                  },
                  pinsLastUpdated: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  chatsLastUpdated: {
                    type: "int64",
                    id: 3,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  updatedMessageIds: {
                    rule: "repeated",
                    type: "int64",
                    id: 4,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  othersLastRead: {
                    type: "int64",
                    id: 5,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  selfLastRead: {
                    type: "int64",
                    id: 6,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  unreadMentionMessageId: {
                    type: "int64",
                    id: 7,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  hasNext: {
                    type: "bool",
                    id: 8
                  },
                  socketError: {
                    type: "SocketError",
                    id: 9
                  }
                }
              },
              LeaveChatPacket: {
                fields: {
                  chatId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  userId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              LeaveChatAck: {
                fields: {
                  messages: {
                    rule: "repeated",
                    type: "ChatMessage",
                    id: 1
                  },
                  socketError: {
                    type: "SocketError",
                    id: 2
                  }
                }
              },
              HistoryMessagesPacket: {
                fields: {
                  chatId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  messageId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  userId: {
                    type: "int64",
                    id: 3,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              HistoryMessagesAck: {
                fields: {
                  messages: {
                    rule: "repeated",
                    type: "ChatMessage",
                    id: 1
                  },
                  socketError: {
                    type: "SocketError",
                    id: 2
                  }
                }
              },
              NextMessagesPacket: {
                fields: {
                  chatId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  messageId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  userId: {
                    type: "int64",
                    id: 3,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              NextMessagesAck: {
                fields: {
                  messages: {
                    rule: "repeated",
                    type: "ChatMessage",
                    id: 1
                  },
                  socketError: {
                    type: "SocketError",
                    id: 2
                  }
                }
              },
              AroundMessagesPacket: {
                fields: {
                  chatId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  messageId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  userId: {
                    type: "int64",
                    id: 3,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              AroundMessagesAck: {
                fields: {
                  messages: {
                    rule: "repeated",
                    type: "ChatMessage",
                    id: 1
                  },
                  socketError: {
                    type: "SocketError",
                    id: 2
                  }
                }
              },
              NewestMessagesPacket: {
                fields: {
                  chatId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  userId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              NewestMessagesAck: {
                fields: {
                  messages: {
                    rule: "repeated",
                    type: "ChatMessage",
                    id: 1
                  },
                  socketError: {
                    type: "SocketError",
                    id: 2
                  }
                }
              },
              RecallMessagePacket: {
                fields: {
                  chatId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  messageId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  recallerId: {
                    type: "int64",
                    id: 3,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              RecallMessageAck: {
                fields: {
                  recalledMessage: {
                    type: "ChatMessage",
                    id: 1
                  },
                  socketError: {
                    type: "SocketError",
                    id: 2
                  }
                }
              },
              FailedMessage: {
                fields: {
                  messageId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  reason: {
                    type: "string",
                    id: 2
                  }
                }
              },
              ReceiveMessagePacket: {
                fields: {
                  messages: {
                    rule: "repeated",
                    type: "ChatMessage",
                    id: 1
                  },
                  hasUnread: {
                    type: "bool",
                    id: 2
                  }
                }
              },
              ReceiveMessageAck: {
                fields: {
                  lastMessageId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  failedMessages: {
                    rule: "repeated",
                    type: "FailedMessage",
                    id: 2
                  }
                }
              },
              Read: {
                fields: {
                  chatId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  messageId: {
                    type: "int64",
                    id: 2,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  senderId: {
                    type: "int64",
                    id: 3,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              SendReadPacket: {
                fields: {
                  reads: {
                    rule: "repeated",
                    type: "Read",
                    id: 1
                  }
                }
              },
              SendReadAck: {
                fields: {
                  socketError: {
                    type: "SocketError",
                    id: 1
                  }
                }
              },
              ReceiveReadPacket: {
                fields: {
                  read: {
                    type: "Read",
                    id: 3
                  }
                }
              },
              TypingPacket: {
                fields: {
                  senderId: {
                    type: "int64",
                    id: 1,
                    options: {
                      jstype: "JS_STRING"
                    }
                  },
                  avatar: {
                    type: "string",
                    id: 2
                  },
                  chatId: {
                    type: "int64",
                    id: 3,
                    options: {
                      jstype: "JS_STRING"
                    }
                  }
                }
              },
              SocketError: {
                fields: {
                  code: {
                    type: "int32",
                    id: 1
                  },
                  message: {
                    type: "string",
                    id: 2
                  }
                }
              },
              NewTokenPacket: {
                fields: {
                  aliasId: {
                    type: "int64",
                    id: 1
                  },
                  newToken: {
                    type: "string",
                    id: 2
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  google: {
    nested: {
      protobuf: {
        nested: {
          DoubleValue: {
            fields: {
              value: {
                type: "double",
                id: 1
              }
            }
          },
          FloatValue: {
            fields: {
              value: {
                type: "float",
                id: 1
              }
            }
          },
          Int64Value: {
            fields: {
              value: {
                type: "int64",
                id: 1
              }
            }
          },
          UInt64Value: {
            fields: {
              value: {
                type: "uint64",
                id: 1
              }
            }
          },
          Int32Value: {
            fields: {
              value: {
                type: "int32",
                id: 1
              }
            }
          },
          UInt32Value: {
            fields: {
              value: {
                type: "uint32",
                id: 1
              }
            }
          },
          BoolValue: {
            fields: {
              value: {
                type: "bool",
                id: 1
              }
            }
          },
          StringValue: {
            fields: {
              value: {
                type: "string",
                id: 1
              }
            }
          },
          BytesValue: {
            fields: {
              value: {
                type: "bytes",
                id: 1
              }
            }
          }
        }
      }
    }
  }
});

module.exports = $root;
