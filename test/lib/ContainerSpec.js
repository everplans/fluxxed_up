import Container from '../../src/lib/Container'

const store = {store: 'bar'}
const action = {action: 'bar'}

describe('Container', () => {
  before(() => {
    Container.registerAction('foo', action)
    Container.registerStore('foo', store)
  })
  after(() => { Container.init() })

  it('registers an action', () => expect(Container.getAction('foo')).to.equal(action))
  it('registeres a store', () => expect(Container.getStore('foo')).to.equal(store))
  it('does not return a blank component', () => expect(Container.getAction('noExisto')).to.not.exist)
})
