const should = require('should')
const und = require('underscore')

const _ = require('./utils_builder')

describe('Utils', () => {
  describe('buildPath', () => {
    it('should return a string with parameters', done => {
      const path = _.buildPath('http://hero/api', {action: 'man'})
      path.should.be.a.String
      path.should.equal('http://hero/api?action=man')
      done()
    })

    it('should not add empty parameters', done => {
      const path = _.buildPath('http://hero/api', {action: 'man', boudu: null})
      path.should.equal('http://hero/api?action=man')
      done()
    })
  })

  const queries = {
    good: 'category=book&text=whatever&claim=youknowhat&answer=imhappy',
    goodToo: '?category=book&text=whatever&claim=youknowhat&answer=imhappy',
    uncompleteButGood: '?category=book&text=&claim=&answer=imhappy'
  }

  describe('parseQuery', () => {
    it('should return an object', done => {
      _.parseQuery(queries.good).should.be.an.Object
      _.parseQuery(queries.goodToo).should.be.an.Object
      _.parseQuery(queries.uncompleteButGood).should.be.an.Object
      _.parseQuery().should.be.an.Object
      _.parseQuery(null).should.be.an.Object
      _.log(_.parseQuery(queries.goodToo), queries.goodToo)
      done()
    })

    it("should forgive and forget the '?' before queries", done => {
      queries.goodToo[0].should.equal('?')
      const queryObj = _.parseQuery(queries.goodToo)
      for (let k in queryObj) {
        const v = queryObj[k]
        k[0].should.not.equal('?')
      }
      _.isEqual(_.parseQuery(queries.goodToo), _.parseQuery(queries.good)).should.be.true
      done()
    })
  })

  describe('idGenerator', () => {
    it('should return a string', done => {
      _.idGenerator(10).should.be.a.String
      done()
    })

    it('should return a string with the right length', done => {
      _.idGenerator(10).length.should.equal(10)
      _.idGenerator(6).length.should.equal(6)
      _.idGenerator(100).length.should.equal(100)
      done()
    })

    it('should return a string withoutFigures is asked', done => {
      const figurePattern = /[0-9]/
      figurePattern.test(_.idGenerator(100)).should.be.true
      figurePattern.test(_.idGenerator(100, true)).should.be.false
      done()
    })
  })

  describe('pickToArray', () => {
    it('should return an array', done => {
      const obj = {
        a: 15,
        b: 25,
        c: 35
      }
      const array = ['b', 'c']
      _.pickToArray(obj, array).should.be.an.Array
      _.pickToArray(obj, array).length.should.equal(2)
      _.pickToArray(obj, array)[0].should.equal(25)
      _.pickToArray(obj, array)[1].should.equal(35)
      done()
    })
  })

  describe('duplicatesArray', () => {
    it('should return an array filled with the string', done => {
      const hops = _.duplicatesArray('hop', 3)
      hops.length.should.equal(3)
      hops.forEach(el => el.should.equal('hop'))

      const blops = _.duplicatesArray('blop', 100)
      blops.length.should.equal(100)
      blops.forEach(el => el.should.equal('blop'))
      done()
    })
  })

  const validUrls = [
    'http://yo.fr',
    'https://yo.fr',
    'https://yo.yo.fr',
    'https://y_o.yo.fr',
    'https://y-o.yo.fr',
    'https://hello:pwd@y-o.yo.holidays:3006',
    'https://hello:pwd@y-o.yo.holidays:3006/glou_-bi?q=boulga#yolo'
  ]

  const invalidUrls = [
    'nop',
    'yo.fr',
    'htp://yo.fr',
    'http//yo.fr',
    'https//yo.fr',
    'http:/yo.fr',
    'http:/yo.fr',
    'http://yo-.yo.fr',
    'http://yo_.yo.fr',
    'http://_yo.yo.fr',
    'http://yo._yo.fr'
  ]

  describe('isUrl', () => {
    it('should return true on valid urls', done => {
      und.all(validUrls, _.isUrl).should.equal(true)
      done()
    })

    it('should return false on invalid urls', done => {
      und.any(invalidUrls, _.isUrl).should.equal(false)
      done()
    })
  })

  const imgRoot = 'http://somehost:3006'

  describe('imgSrc', () => {
    it('should return a function', done => {
      _.imgSrc(imgRoot).should.be.a.Function()
      done()
    })

    it('should return a function that return a url', done => {
      _.imgSrc(imgRoot)(validUrls[0]).should.equal(`${imgRoot}/img/1600x1600/1117971502?href=http%3A%2F%2Fyo.fr`)
      _.imgSrc(imgRoot)(validUrls[0], 300).should.equal(`${imgRoot}/img/300x1600/1117971502?href=http%3A%2F%2Fyo.fr`)
      done()
    })
  })
})
