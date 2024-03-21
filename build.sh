rm -rf build_assets build

mkdir build_assets && cd build_assets
git clone https://github.com/libusb/libusb --depth 1
git clone https://github.com/raspberrypi/picotool --depth 1
git clone https://github.com/raspberrypi/pico-sdk --depth 1

SOURCE=$(realpath .)

cd libusb
autoreconf -fiv
emconfigure ./configure --host=wasm32-emscripten --prefix=${SOURCE}/libusb/build
emmake make install

cd ${SOURCE}

cd pico-sdk
cat ${SOURCE}/../sdk.patch | patch -p1

cd ${SOURCE}

mkdir picotool/build && cd picotool/build
export PICO_SDK_PATH=${SOURCE}/pico-sdk
emcmake cmake .. -DLIBUSB_INCLUDE_DIR=${SOURCE}/libusb/build/include/libusb-1.0 -DLIBUSB_LIBRARIES=${SOURCE}/libusb/build/lib/libusb-1.0.a -DCMAKE_EXE_LINKER_FLAGS='--bind -s ASYNCIFY -s ALLOW_MEMORY_GROWTH -s INVOKE_RUN=0 -s EXPORTED_RUNTIME_METHODS="[\"callMain\", \"FS\"]" -pthread -mbulk-memory -s EXPORT_ES6 -s MODULARIZE=1 -sFORCE_FILESYSTEM -sEXIT_RUNTIME=1' -DCMAKE_C_FLAGS="-pthread -mbulk-memory" -DCMAKE_CXX_FLAGS="-pthread -mbulk-memory"
emmake make -j8

cd ${SOURCE}
mkdir ../build
cp picotool/build/{picotool.js,picotool.worker.mjs,picotool.wasm} ../build
