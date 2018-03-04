'use strict';

var expect = require('chai').expect;
var toQueryParams = require('../index');

describe('#toQueryParams', function() {
    it('should return {section: "blog", id: "45"}', function() {
        var result = toQueryParams('section=blog&id=45');
        expect(result).to.deep.equal({section: 'blog', id: '45'});
    });

    it('should return {name: "peter", age: "23"}', function() {
        var result = toQueryParams('http://www.example.com?name=peter;age=23', ';');
        expect(result).to.deep.equal({name: 'peter', age: '23'});
    });

    it('should return {animals: ["snake", "monkey", "lion"}', function() {
        var result = toQueryParams('/path?animals=snake/animals=monkey/animals=lion', '/');
        expect(result).to.deep.equal({animals: ['snake', 'monkey', 'lion']});
    });
    
    it('should return {lang: "coffescript", tag: ["javascript", "prototype"]}', function() {
        var result = toQueryParams('lang=coffescript&tag=javascript&tag=prototype');
        expect(result).to.deep.equal({lang: 'coffescript', tag: ['javascript', 'prototype']});
    });
    
    it('should return {tag: "ruby on rails"}', function() {
        var result = toQueryParams('tag=ruby%20on%20rails');
        expect(result).to.deep.equal({tag: 'ruby on rails'});
    });
    
    it('should return {id: "45", raw: undefined}', function() {
        var result = toQueryParams('id=45&raw');
        expect(result).to.deep.equal({id: '45', raw: undefined});
    });
});
