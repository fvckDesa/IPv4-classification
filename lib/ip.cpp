#include <stdint.h>
#include <string>
#include <array>
#include <iostream>
#include <bitset>
#include <emscripten/emscripten.h>
#include <emscripten/bind.h>

#ifdef __cplusplus
#define EXTERN extern "C"
#else
#define EXTERN
#endif

#define IP_LENGTH 4

using namespace emscripten;

using IP_address = std::array<uint8_t, IP_LENGTH>;
using BinaryAddress = std::array<std::string, IP_LENGTH>;

enum ClassType
{
  A = 1,
  B = 2,
  C = 3
};

struct IP
{
  IP_address address, submask, netId, hostId, broadcast;
  BinaryAddress binary;
  ClassType classType;
};

BinaryAddress addressToBinary(const IP_address &address)
{
  BinaryAddress binary;
  for (size_t i = 0; i < IP_LENGTH; i++)
  {
    binary[i] = std::bitset<8>(address[i]).to_string();
  }

  return binary;
}

ClassType getClassType(uint8_t firstByte)
{
  // Class C when first 2 significant bit are 1
  if (firstByte >= 128 + 64)
  {
    return C;
  }
  // Class B when first significant bit is 1
  if (firstByte >= 128)
  {
    return B;
  }
  // Class A when first significant bit is 0
  return A;
}

IP_address getSubmask(ClassType type)
{
  IP_address sub;
  for (size_t i = 0; i < IP_LENGTH; i++)
  {
    sub[i] = i < type ? 255 : 0;
  }
  return sub;
}

IP_address
getNetId(IP_address address, ClassType type)
{
  for (size_t i = IP_LENGTH - 1; i > type - 1; i--)
  {
    address[i] = 0;
  }
  return address;
}

IP_address getHostId(IP_address address, ClassType type)
{
  for (size_t i = 0; i < type; i++)
  {
    address[i] = 0;
  }
  return address;
}

IP_address getBroadcast(IP_address netId, ClassType type)
{
  for (size_t i = IP_LENGTH - 1; i > type - 1; i--)
  {
    netId[i] = 255;
  }
  return netId;
}

EXTERN EMSCRIPTEN_KEEPALIVE IP make_IP(const IP_address &address)
{
  IP newIP;

  newIP.address = address;
  newIP.classType = getClassType(address[0]);
  newIP.submask = getSubmask(newIP.classType);
  newIP.binary = addressToBinary(address);
  newIP.netId = getNetId(address, newIP.classType);
  newIP.hostId = getHostId(address, newIP.classType);
  newIP.broadcast = getBroadcast(newIP.netId, newIP.classType);

  return newIP;
}

EMSCRIPTEN_BINDINGS(my_module)
{
  value_array<IP_address>("IP_address")
      .element(emscripten::index<0>())
      .element(emscripten::index<1>())
      .element(emscripten::index<2>())
      .element(emscripten::index<3>());

  value_array<BinaryAddress>("BinaryAddress")
      .element(emscripten::index<0>())
      .element(emscripten::index<1>())
      .element(emscripten::index<2>())
      .element(emscripten::index<3>());

  enum_<ClassType>("ClassType")
      .value("A", A)
      .value("B", B)
      .value("C", C);

  value_object<IP>("IP")
      .field("address", &IP::address)
      .field("submask", &IP::submask)
      .field("netId", &IP::netId)
      .field("hostId", &IP::hostId)
      .field("broadcast", &IP::broadcast)
      .field("binary", &IP::binary)
      .field("classType", &IP::classType);

  function("make_IP", &make_IP);
}