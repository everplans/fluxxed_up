import utils from '../../test/support/TestUtils'
import jsonStatham from'../../src/lib/jsonStatham'
import AjaxAdaptorBase from '../../src/lib/AjaxAdaptorBase'

describe('jsonStatham', function() {
var spy
const args = () => spy.getCall(0).args[0]

class TestAdaptor extends AjaxAdaptorBase {
  pathRoot() { return '/api' }
  serverBase() { return 'http://test.com' }
}

  var server

  jsonStatham.setAdaptor(new testAdaptor())

  beforeEach(function() {
    spy = sinon.spy($, 'ajax')
    server = sinon.fakeServer.create()
  })

  afterEach(function() {
    $.ajax.restore()
    server.restore()
  })


  describe('mechanics: ', function() {
    it('builds get request', function() {
      jsonStatham.get('/bla')
      expect(args().url).to.equal('http://test.com/api/bla')
    })

    it('builds PUT request', function() {
      jsonStatham.put('/bla', {param: 'some data'})
      expect(args().url).to.equal('http://test.com/api/bla')
      expect(args().method).to.equal('PUT')
      expect(args().data.param).to.equal('some data')
    })

    it('builds POST request', function() {
      jsonStatham.post('/bla', {param: 'some data'})
      expect(args().url).to.equal('http://test.com/api/bla')
      expect(args().method).to.equal('POST')
      expect(args().data.param).to.equal('some data')
    })

    it('builds delete request', function() {
      jsonStatham.delete('/bla', {param: 'some data'})
      expect(args().url).to.equal('http://test.com/api/bla')
      expect(args().method).to.equal('DELETE')
      expect(args().data.param).to.equal('some data')
    })

    it('sets auth credentials', function() {
      expect(jsonStatham.buildRequest('/bla', null, {}, true).xhrFields.withCredentials).to.equal(true)
    })

    it('does not set auth credentials', function() {
      expect(jsonStatham.buildRequest('/bla').xhrFields).to.equal(undefined)
    })

    it('sends post with auth credentials', function() {
      jsonStatham.post('/bla', {email: 'dude@dude.com'}, true)
      expect(args().xhrFields.withCredentials).to.equal(true)
    })
  })

  describe('requests: ', function () {

    it('GET json', function(done) {
      utils.createServerAndMock('GET', '/api/test', JSON.stringify({fun: 'times'}), server, 200)

      jsonStatham.fetch('/test').done(function(data) {
        expect(data.fun).to.equal('times')
        done()
      })
    })

    it('POST data', function(done) {
      utils.createServerAndMock('POST', '/api/test', JSON.stringify({fun: 'times for post'}), server, 200)

      jsonStatham.post('/test').done(function(data) {
        expect(data.fun).to.equal('times for post')
        done()
      })
    })

    it('POST data with error', function(done) {
      utils.createServerAndMock('POST', '/api/test', JSON.stringify({error: {message: 'oops'}}), server, 422)
      jsonStatham.post('/test').done(function() {}).fail(function(data) {
        expect(data.error.message).to.equal('oops')
        done()
      })
    })

    it('POST file', function(done) {
      utils.createServerAndMock('POST', '/api/test', JSON.stringify({fun: 'times for post'}), server, 200)
      var formData = new FormData()
      formData.append('comments', 'hey there', 'stuff')
      jsonStatham.postFile('/test').done(function(data) {
        expect(data.fun).to.equal('times for post')
        done()
      })
    })

    it ('POST file with error', function(done) {
      utils.createServerAndMock('POST', '/api/test', JSON.stringify({error: {message: 'oops'}}), server, 422)
      var formData = new FormData()
      formData.append('comments', 'hey there', 'stuff')
      jsonStatham.postFile('/test', formData).fail(function(data) {
        expect(data.error.message).to.equal('oops')
        done()
      })
    })
  })
})
