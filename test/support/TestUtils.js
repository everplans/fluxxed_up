class Utils  {
  constructor() {
    this.uriBase= "http://test.com"
  }
  mockResponse(server, method, url, response) {
    server.autoRespond = true
    server.respondWith(method, url, response);
  }
  response(code, body) {
    return function(xhr) {
      xhr.respond(code, '{"Content-Type": "application/json"}', body)
    }
  }
  response200(body) { return this.response(200, body) }
  response422(body) { return this.response(422, body) }
  createServerAndMock(method, url, fixtureRespone, server, code) {
    if (typeof(server) == 'undefined')
      server = sinon.fakeServer.create();
    if (typeof(code) == 'undefined')
      code = 200;
    this.mockResponse(server, method, this.uriBase + url, this.response(code, fixtureRespone));
    return server;
  }
}

export default new Utils()