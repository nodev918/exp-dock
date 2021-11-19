import socket
HOST = 'localhost'
PORT = 55558
SOCKET = socket.socket(socket.AF_INET, socket.SOCK_STREAM)


def gogo():
    SOCKET.bind((HOST, PORT))

    SOCKET.listen(1)
    print("server: "+str(HOST)+":"+str(PORT))
    while 1:
        connection, address = SOCKET.accept()
        print("new connection comming")
        data = connection.recv(4096).decode()
        print(data)
        connection.sendall(b'hello')
gogo()









def handle_put():
    return "hello put"
def handle_get():
    return "hello get"
COMMAND = {
    "PUT":handle_put,
    "GET":handle_get,
}

print(COMMAND["PUT"]())