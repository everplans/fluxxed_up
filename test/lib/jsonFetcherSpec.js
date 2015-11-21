import utils from '../../test/support/TestUtils'
import fetcher from'../../src/lib/jsonFetcher'
import AjaxAdaptorBase from '../../src/lib/AjaxAdaptorBase'

describe('jsonFetcher', function() {
  var listener
  var server
  var spy

  class testAdaptor extends AjaxAdaptorBase {
    serverBase() { return 'http://test.com' }
    pathRoot() { return '/api' }
  }
  fetcher.setAdaptor(new testAdaptor())

  beforeEach(function() {
    spy = sinon.spy($, 'ajax')
  })

  afterEach(function() {
    $.ajax.restore()
  })

  function args() {
    return spy.getCall(0).args[0]
  }

  describe('mechanics: ', function() {
    it('builds get request', function() {
      fetcher.get('/bla')
      expect(args().url).to.equal('http://test.com/api/bla')
    })

    it('builds PUT request', function() {
      fetcher.put('/bla', {param: 'some data'})
      expect(args().url).to.equal('http://test.com/api/bla')
      expect(args().method).to.equal('PUT')
      expect(args().data.param).to.equal('some data')
    })

    it('builds POST request', function() {
      fetcher.post('/bla', {param: 'some data'})
      expect(args().url).to.equal('http://test.com/api/bla')
      expect(args().method).to.equal('POST')
      expect(args().data.param).to.equal('some data')
    })

    it('builds delete request', function() {
      fetcher.delete('/bla', {param: 'some data'})
      expect(args().url).to.equal('http://test.com/api/bla')
      expect(args().method).to.equal('DELETE')
      expect(args().data.param).to.equal('some data')
    })

    it('sets auth credentials', function() {
      expect(fetcher.buildRequest('/bla', null, {}, true).xhrFields.withCredentials).to.equal(true)
    })

    it('does not set auth credentials', function() {
      expect(fetcher.buildRequest('/bla').xhrFields).to.equal(undefined)
    })

    it('sends post with auth credentials', function() {
      fetcher.post('/bla', {email: 'dude@dude.com'}, true)
      expect(args().xhrFields.withCredentials).to.equal(true)
    })
  })

  describe('requests: ', function () {
    beforeEach(function() {
      server = sinon.fakeServer.create()
    })

     afterEach(function() {
      server.restore()
    })

    it('GET json', function(done) {
      utils.createServerAndMock('GET', '/api/test', JSON.stringify({fun: 'times'}), server, 200)

      fetcher.fetch('/test').done(function(data) {
        expect(data.fun).to.equal('times')
        done()
      })
    })

    it('POST data', function(done) {
      utils.createServerAndMock('POST', '/api/test', JSON.stringify({fun: 'times for post'}), server, 200)

      fetcher.post('/test').done(function(data) {
        expect(data.fun).to.equal('times for post')
        done()
      })
    })

    it('POST data with error', function(done) {
      utils.createServerAndMock('POST', '/api/test', JSON.stringify({error: {message: 'oops'}}), server, 422)
      fetcher.post('/test').done(function() {}).fail(function(data) {
        expect(data.error.message).to.equal('oops')
        done()
      })
    })

    it('POST file', function(done) {
      utils.createServerAndMock('POST', '/api/test', JSON.stringify({fun: 'times for post'}), server, 200)
      var formData = new FormData()
      formData.append('comments', 'hey there', 'stuff')
      fetcher.postFile('/test').done(function(data) {
        expect(data.fun).to.equal('times for post')
        done()
      })
    })

    it ('POST file with error', function(done) {
      utils.createServerAndMock('POST', '/api/test', JSON.stringify({error: {message: 'oops'}}), server, 422)
      var formData = new FormData()
      formData.append('comments', 'hey there', 'stuff')
      fetcher.postFile('/test', formData).fail(function(data) {
        expect(data.error.message).to.equal('oops')
        done()
      })
    })
  })
})
