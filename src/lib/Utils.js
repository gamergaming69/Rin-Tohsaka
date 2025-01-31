const axios = require('axios').default
const { tmpdir } = require('os')
const cheerio = require('cheerio')
const { promisify } = require('util')
const { exec } = require('child_process')
const child_process = require('child_process')
const { readFile, unlink, writeFile } = require('fs-extra')
const { Configuration, OpenAIApi } = require('openai')
let fs = require('fs')
const sleep =  (ms) =>{
    return new Promise((resolve) =>{ setTimeout (resolve, ms)})
    
    }
//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

const configuration = new Configuration({
    apiKey: process.env.openAi
})
const openai = new OpenAIApi(configuration)

const clean = (data) => {
    let regex = /(<([^>]+)>)/gi;
    data = data.replace(/(<br?\s?\/>)/gi, " \n");
    return data.replace(regex, "");
  };
  
  async function shortener(url) {
    return url;
  }

module.exports = class Utils {
    constructor() {}

/**
 * @param {string} code -
 * @returns {Promise<Buffer>} 
 */

getCodeImage = async (code) => {
  try {
    const url = `https://carbon.now.sh/?code=${encodeURIComponent(code)}`
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)
    const imageUrl = $('#export-container .export-container-main .export-container-bg')[0].attribs['data-src']
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    const imageData = Buffer.from(imageResponse.data, 'binary')
    fs.writeFileSync('code.png', imageData)
    return imageData
  } catch (error) {
    console.error(error)
  }
}

    /**
     * @param {string} query
     */
      
      Tiktok = async(query) => {
        let response = await axios("https://lovetik.com/api/ajax/search", {
          method: "POST",
          data: new URLSearchParams(Object.entries({ query })),
        });
      
        let result = {};
      
        result.creator = "YNTKTS";
        result.title = clean(response.data.desc);
        result.author = clean(response.data.author);
        result.nowm = await shortener(
          (response.data.links[0].a || "").replace("https", "http")
        );
        result.watermark = await shortener(
          (response.data.links[1].a || "").replace("https", "http")
        );
        result.audio = await shortener(
          (response.data.links[2].a || "").replace("https", "http")
        );
        result.thumbnail = await shortener(response.data.cover);
        return result;
      }


      /**
       * @param {string} url 
       * @param {object} [options]
       * @returns {Promise}
       */

      fetchJson = async (url, options) => {
        try {
            options ? options : {}
            const res = await axios({
                method: 'GET',
                url: url,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
                },
                ...options
            })
            return res.data
        } catch (err) {
            return err
        }
    }
    /**
     * @param {string} url
     * @returns {Promise<Buffer>}
     */

    getBuffer = async (url) =>
        (
            await axios.get(url, {
                responseType: 'arraybuffer'
            })
        ).data
    /**
     * @param {string} content
     * @param {boolean} all
     * @returns {string}
     */

    capitalize = (content, all = false) => {
        if (!all) return `${content.charAt(0).toUpperCase()}${content.slice(1)}`
        return `${content
            .split(' ')
            .map((text) => `${text.charAt(0).toUpperCase()}${text.slice(1)}`)
            .join(' ')}`
    }

    /**
     * @returns {string}
     */

    generateRandomHex = () => `#${(~~(Math.random() * (1 << 24))).toString(16)}`

    /**
     * @param {number} length
     * @returns {string}
     */

    generateRandomUniqueTag = (length) => {
        let max = 12 - 1
        if (length > max) return this.generateRandomUniqueTag(max) + this.generateRandomUniqueTag(length - max)
        max = Math.pow(10, length + 1)
        const min = max / 10
        const number = Math.floor(Math.random() * (max - min + 1)) + min
        return number.toString().substring(1)
    }

    /**
     * @param {string} content
     * @returns {number[]}
     */

    extractNumbers = (content) => {
        const search = content.match(/(-\d+|\d+)/g)
        if (search !== null) return search.map((string) => parseInt(string)) || []
        return []
    }

    /**
     *
     * @param {number} ms
     * @param {'seconds' | 'minutes' | 'hours' | 'days' | 'format'} to
     * @returns {number | { days: number; hours: number; minutes: number; seconds: number }}
     */

    convertMs = (ms, to = 'seconds') => {
        let seconds = parseInt(
            Math.floor(ms / 1000)
                .toString()
                .split('.')[0]
        )
        let minutes = parseInt(
            Math.floor(seconds / 60)
                .toString()
                .split('.')[0]
        )
        let hours = parseInt(
            Math.floor(minutes / 60)
                .toString()
                .split('.')[0]
        )
        let days = parseInt(
            Math.floor(hours / 24)
                .toString()
                .split('.')[0]
        )
        if (to === 'seconds') return seconds
        if (to === 'minutes') return minutes
        if (to === 'hours') return hours
        if (to === 'days') return days
        seconds = parseInt((seconds % 60).toString().split('.')[0])
        minutes = parseInt((minutes % 60).toString().split('.')[0])
        hours = parseInt((hours % 24).toString().split('.')[0])
        return {
            days,
            seconds,
            minutes,
            hours
        }
    }

    /**
     * @param {string} url
     */

    fetch = async (url) => (await axios.get(url)).data

    /**
     * @param {Buffer} webp
     * @returns {Promise<Buffer>}
     */

    webpToPng = async (webp) => {
        const filename = `${tmpdir()}/${Math.random().toString(36)}`
        await writeFile(`${filename}.webp`, webp)
        await this.exec(`dwebp "${filename}.webp" -o "${filename}.png"`)
        const buffer = await readFile(`${filename}.png`)
        Promise.all([unlink(`${filename}.png`), unlink(`${filename}.webp`)])
        return buffer
    }

    /**
     * @param {Buffer} webp
     * @returns {Promise<Buffer>}
     */

    webpToMp4 = async (webp) => {
        const filename = `${tmpdir()}/${Math.random().toString(36)}`
        await writeFile(`${filename}.webp`, webp)
        await this.exec(`magick mogrify -format gif ${filename}.webp`)
        const mp4 = await this.gifToMp4(await readFile(`${filename}.gif`), true)
        const buffer = await readFile(mp4)
        Promise.all([unlink(mp4), unlink(`${filename}.gif`), unlink(`${filename}.gif`)])
        return buffer
    }

    /**
     * @param {string} text
     */
    gpt = async (text) => {
        //gpt-3.5-turbo
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: `${text}`
                }
            ]
        })
    
        return {
            response: completion.data.choices[0].message.content
        }
    }
    
    /**
     * @param {string} text
     */

    createImage = async (text) => {
        const results = await openai.createImage({
            prompt: `${text}`,
            n: 10,
            size: '1024x1024'
        })
        return {
            response: results
        }
    }
    
    /**
     * @param {Buffer} buffer
     * @param {string} text
     */

    editImage = async (text, buffer) => {
        const response = await openai.createImageEdit(
            buffer, 
            fs.createReadStream('image.png'), 
            `${text}`, 2, '1024x1024'
            )
            return {
                response: results
            }
        }
    

    /**
     * @param {string} text
     */

    chat = async (text) => {
        const completion = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `${text}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0
        })
    
        return {
            response: completion.data.choices[0].text
        }
    }

    /**
     * @param {string} text
     */
    
    isUrl = (url) => {
        return url.match(
          new RegExp(
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            "gi"
          )
        );
      };
/**
 * @param {Buffer} image - Buffer containing the image data
 * @returns {Promise<Buffer>} A Promise that resolves to a Buffer containing the processed GIF data
 */
buffergif = async (image) => {
    const filename = `${Math.random().toString(36)}`
    await fs.writeFileSync(`./${filename}.gif`, image)
    child_process.exec(
        `ffmpeg -i ./${filename}.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ./dustbin/${filename}.mp4`
    ) 
    await sleep(4000)
    const buffer5 = await fs.readFileSync(`./${filename}.mp4`)
    Promise.all([unlink(`./${filename}.mp4`), unlink(`./${filename}.gif`)])
    return buffer5
}


    /**
     * @param {Buffer} gif
     * @param {boolean} write
     * @returns {Promise<Buffer | string>}
     */

    gifToMp4 = async (gif, write = false) => {
        const filename = `${tmpdir()}/${Math.random().toString(36)}`
        await writeFile(`${filename}.gif`, gif)
        await this.exec(
            `ffmpeg -f gif -i ${filename}.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ${filename}.mp4`
        )
        if (write) return `${filename}.mp4`
        const buffer = await readFile(`${filename}.mp4`)
        Promise.all([unlink(`${filename}.mp4`), unlink(`${filename}.gif`)])
        return buffer
    }

    exec = promisify(exec)
}
