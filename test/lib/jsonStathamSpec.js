import utils from '../../test/support/TestUtils'
import jsonStatham from'../../src/lib/jsonStatham'
import AjaxAdaptorBase from '../../src/lib/AjaxAdaptorBase'

class TestAdaptor extends AjaxAdaptorBase {
  defaultHeaders() { return {yuri: 'orlov'} }
  pathRoot() { return '/api' }
  serverBase() { return 'http://test.com' }
}

describe('jsonStatham', () => {
  var server
  var spy
  const getArgumentsPassedToSpy = () => spy.getCall(0).args[0]

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
      expect(getArgumentsPassedToSpy().url).to.equal('http://test.com/api/bla')
    })

    it('builds PUT request', () => {
      jsonStatham.put('/bla', {param: 'some data'})
      const spyData = getArgumentsPassedToSpy()
      expect(spyData.url).to.equal('http://test.com/api/bla')
      expect(spyData.method).to.equal('PUT')
      expect(JSON.parse(spyData.data).param).to.equal('some data')
    })

    it('builds POST request', () => {
      jsonStatham.post('/bla', {param: 'some data'})
      const spyData = getArgumentsPassedToSpy()
      expect(spyData.url).to.equal('http://test.com/api/bla')
      expect(spyData.method).to.equal('POST')
      expect(JSON.parse(spyData.data).param).to.equal('some data')
    })

    it('builds delete request', () => {
      jsonStatham.delete('/bla', {param: 'some data'})
      const spyData = getArgumentsPassedToSpy()
      expect(spyData.url).to.equal('http://test.com/api/bla')
      expect(spyData.method).to.equal('DELETE')
      expect(JSON.parse(spyData.data).param).to.equal('some data')
    })
  })

  describe('Headers:', () => {
    it('defaults to a contentType of application/json', () => {
      const opts = jsonStatham.buildRequest('/bla', 'get', {})  // Note: no need to pass additionalHeaders at all.
      expect(opts.headers.contentType).to.equal('application/json')
    })

    it('includes default headers from the adaptor', () => {
      const opts = jsonStatham.buildRequest('/bla', 'get', {})
      expect(opts.headers.yuri).to.equal('orlov')
    })

    it('adds additional headers passed to it', () => {
      const opts = jsonStatham.buildRequest('/bla', 'get', {}, {stanley: 'goodspeed'})
      expect(opts.headers.stanley).to.equal('goodspeed')
    })

    it('overwrites default headers with the same key', () => {
      const opts = jsonStatham.buildRequest('/bla', 'get', {}, {yuri: 'goodspeed'})
      expect(opts.headers.yuri).to.equal('goodspeed')
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

    it('does not attempt to parse whitespace-only strings as JSON', done => {
      const whitespaceOnly = '   '
      utils.createServerAndMock('GET', '/api/test', whitespaceOnly, server, 200)
      jsonStatham.get('/test').done(data => {
        expect(data).to.equal(whitespaceOnly)
        done()
      })
    })
  })
})
