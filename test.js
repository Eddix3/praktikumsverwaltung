import * as MoodleFetchApi from './src/moodleFetch.js'

function test() {
    console.log(MoodleFetchApi.getWSToken('admin', 'Abcd2204%'))
    console.log('hello world')
}