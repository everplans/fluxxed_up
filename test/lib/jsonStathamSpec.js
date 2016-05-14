import utils from '../../test/support/TestUtils'
import jsonStatham from'../../src/lib/jsonStatham'
import AjaxAdaptorBase from '../../src/lib/AjaxAdaptorBase'


var spy
const args = () => spy.getCall(0).args[0]

class TestAdaptor extends AjaxAdaptorBase {
  pathRoot() { return '/api' }
  serverBase() { return 'http://test.com' }
}

describe('jsonStatham', () => {
  var server

  before(() => jsonStatham.setAdaptor(new TestAdaptor()))

  beforeEach(() => {
    spy = sinon.spy($, 'ajax')
    server = sinon.fakeServer.create()
  })
  afterEach(() => {
    $.ajax.restore()
    server.restore()
  })

  describe('mechanics: ', () => {
    it('builds get request', () => {
      jsonStatham.get('/bla')
      expect(args().url).to.equal('http://test.com/api/bla')
    })

    it('builds PUT request', () => {
      jsonStatham.put('/bla', {param: 'some data'})
      expect(args().url).to.equal('http://test.com/api/bla')
      expect(args().method).to.equal('PUT')
      expect(args().data.param).to.equal('some data')
    })

    it('builds POST request', () => {
      jsonStatham.post('/bla', {param: 'some data'})
      expect(args().url).to.equal('http://test.com/api/bla')
      expect(args().method).to.equal('POST')
      expect(args().data.param).to.equal('some data')
    })

    it('builds delete request', () => {
      jsonStatham.delete('/bla', {param: 'some data'})
      expect(args().url).to.equal('http://test.com/api/bla')
      expect(args().method).to.equal('DELETE')
      expect(args().data.param).to.equal('some data')
    })

    it('sets auth credentials', () => {
      expect(jsonStatham.buildRequest('/bla', null, {}, true).xhrFields.withCredentials).to.equal(true)
    })

    it('does not set auth credentials', () => {
      expect(jsonStatham.buildRequest('/bla').xhrFields).to.equal(undefined)
    })

    it('sends post with auth credentials', () => {
      jsonStatham.post('/bla', {email: 'dude@dude.com'}, true)
      expect(args().xhrFields.withCredentials).to.equal(true)
    })
  })

  describe('requests: ', () => {
    it('GET json', done => {
      utils.createServerAndMock('GET', '/api/test', JSON.stringify({fun: 'times'}), server, 200)

      jsonStatham.get('/test').done(data => {
        expect(data.fun).to.equal('times')
        done()
      })
    })

    it('POST data', done => {
      utils.createServerAndMock('POST', '/api/test', JSON.stringify({fun: 'times for post'}), server, 200)

      jsonStatham.post('/test').done(data => {
        expect(data.fun).to.equal('times for post')
        done()
      })
    })

    it('POST data with error', done => {
      utils.createServerAndMock('POST', '/api/test', JSON.stringify({error: {message: 'oops'}}), server, 422)
      jsonStatham.post('/test').done(function() {}).fail(data => {
        expect(data.error.message).to.equal('oops')
        done()
      })
    })

    it('POST file', done => {
      utils.createServerAndMock('POST', '/api/test', JSON.stringify({fun: 'times for post'}), server, 200)
      var formData = new FormData()
      formData.append('comments', 'hey there', 'stuff')
      jsonStatham.postFile('/test').done(data => {
        expect(data.fun).to.equal('times for post')
        done()
      })
    })

    it('POST file with error', done => {
      utils.createServerAndMock('POST', '/api/test', JSON.stringify({error: {message: 'oops'}}), server, 422)
      var formData = new FormData()
      formData.append('comments', 'hey there', 'stuff')
      jsonStatham.postFile('/test', formData).fail(data => {
        expect(data.error.message).to.equal('oops')
        done()
      })
    })
  })
})
