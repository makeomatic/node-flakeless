#include <nan.h>
#include "flakeless.h"

NAN_MODULE_INIT(InitAll) {
  Flakeless::Init(target);
}

NODE_MODULE(flakeless, InitAll)
