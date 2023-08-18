import * as MoodleFetchApi from '@/backend/moodleFetch.js'

function test() {
    console.log(MoodleFetchApi.getWSToken('admin', 'Abcd2204%'))
    console.log('hello world')
}