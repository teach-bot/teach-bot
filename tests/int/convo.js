
const chai = require('chai')
const expect = chai.expect

const db = require('../../src/db')
const convo = require('../../src/convo')

describe('convo', () => {
  before(async () => {
    await db.Convo.sync({ force: true }) // drops table and re-creates it
  })

  describe('set', () => {
    it('creates a convo if one does not exist', (done) => {
      convo.set('1234', {a: 1, b: 2}, () => {
        db.Convo.findOne({where: { key: '1234' }}).then((row) => {
          expect(row).to.not.be.a('null')
          expect(JSON.parse(row.value)).to.eql({a: 1, b: 2, id: '1234'})
          done()
        })
      })
    })

    it('updates a convo if one does exist', (done) => {
      new db.Convo({key: 'abcd', value: '{"a": "b"}'}).save().then((success) => {
        convo.set('abcd', {a: 1, b: 2}, () => {
          db.Convo.findOne({where: { key: 'abcd' }}).then((row) => {
            expect(row).to.not.be.a('null')
            expect(JSON.parse(row.value)).to.eql({a: 1, b: 2, id: 'abcd'})
            done()
          })
        })
      })
    })
  })

  describe('get', () => {
    it('returns a convo when it exits', (done) => {
      new db.Convo({key: 'zyza', value: '{"a": "b"}'}).save().then(() => {
        convo.get('zyza', (error, value) => {
          expect(error).to.be.a('null')
          expect(value).to.eql({'a': 'b'})
          done()
        })
      })
    })

    it('returns null when a convo does not exist ', (done) => {
      convo.get('xyz', (error, value) => {
        expect(error).to.be.a('null')
        expect(value).to.be.a('null')
        done()
      })
    })
  })

  describe('del', () => {
    it('deletes the convo when it exits', (done) => {
      new db.Convo({key: 'owowo', value: '{"a": "b"}'}).save().then((success) => {
        convo.del('owowo', (error) => {
          expect(error).to.be.an('undefined')
          // See if the value exits
          db.Convo.findOne({where: {key: 'owowo'}}).then((row) => {
            expect(row).to.be.a('null')
            done()
          })
        })
      })
    })

    it('silently fail if the convo does not exits', (done) => {
      convo.del('pwoal', (error) => {
        expect(error).to.be.an('undefined')
        done()
      })
    })
  })
})
