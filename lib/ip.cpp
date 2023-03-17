#include <stdint.h>
#include <string>
#include <array>
#include <iostream>
#include <bitset>

#define IP_LENGTH 4

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

std::string toString(const IP_address &ip)
{
  std::string str;
  for (int i = 0; i < 4; i++)
  {
    str += std::to_string(+ip[i]);
    if (i < 3)
    {
      str += ".";
    }
  }
  return str;
}
std::string toString(const BinaryAddress &ip)
{
  std::string str;
  for (int i = 0; i < 4; i++)
  {
    str += ip[i];
    if (i < 3)
    {
      str += ".";
    }
  }
  return str;
}

std::string toString(const ClassType &c)
{
  std::string str;
  switch (c)
  {
  case A:
    str = "A";
    break;
  case B:
    str = "B";
    break;
  case C:
    str = "C";
    break;
  }
  return str;
}

std::ostream &operator<<(std::ostream &o, const IP &a)
{
  o << "address: " << toString(a.address) << std::endl;
  o << "submask: " << toString(a.submask) << std::endl;
  o << "netId: " << toString(a.netId) << std::endl;
  o << "hostId: " << toString(a.hostId) << std::endl;
  o << "broadcast: " << toString(a.broadcast) << std::endl;
  o << "binary: " << toString(a.binary) << std::endl;
  o << "class: " << toString(a.classType) << std::endl;
  return o;
}

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

IP make_IP(const IP_address &address)
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

int main()
{
  IP_address ip = {192, 168, 1, 1};
  IP cIp = make_IP(ip);
  std::cout << cIp << std::endl;
  return 0;
}