// Google Apps Script API endpoint
const GAS_URL = 'https://script.google.com/macros/s/AKfycbyAQAgaXj_SjZqJdwtcfaXrzcG-v1Bxqs7RRyofJTijzOMmu9J8ab4XdDScCW3hFUiw/exec'

// Throttling: max 15 concurrent requests
let _gsQueue = []
let _gsInFlight = 0
const _gsMaxConcurrent = 15

function _gsProcessQueue() {
  if (_gsInFlight >= _gsMaxConcurrent || _gsQueue.length === 0) return

  const req = _gsQueue.shift()
  _gsInFlight++

  const originalCallback = req.callback
  req.callback = function(err, data) {
    _gsInFlight--
    if (originalCallback) originalCallback(err, data)
    _gsProcessQueue()
  }

  _gsCallImpl(req.params, req.callback)
}

// JSONP callback tracking
const _gsCallbacks = {}
let _gsCallId = 0

function gsCall(params, callback) {
  return new Promise((resolve, reject) => {
    const wrappedCallback = (err, data) => {
      if (callback) callback(err, data)
      if (err) reject(err)
      else resolve(data)
    }

    const isPriority = params.action && params.action.indexOf('save') === 0
    if (isPriority || (_gsInFlight < _gsMaxConcurrent && _gsQueue.length === 0)) {
      _gsCallImpl(params, wrappedCallback)
    } else {
      _gsQueue.push({ params, callback: wrappedCallback })
      _gsProcessQueue()
    }
  })
}

function _gsCallImpl(params, callback) {
  const callId = ++_gsCallId
  const jsonpCallback = `_gsCallback${callId}`

  window[jsonpCallback] = function(response) {
    delete window[jsonpCallback]
    const script = document.getElementById(`gs-script-${callId}`)
    if (script) script.remove()

    if (callback) callback(null, response)
  }

  const url = new URL(GAS_URL)
  Object.entries(params).forEach(([k, v]) => {
    url.searchParams.append(k, typeof v === 'object' ? JSON.stringify(v) : v)
  })
  url.searchParams.append('callback', jsonpCallback)

  const script = document.createElement('script')
  script.id = `gs-script-${callId}`
  script.src = url.toString()
  script.onerror = () => {
    delete window[jsonpCallback]
    script.remove()
    if (callback) callback(new Error('JSONP request failed'))
  }

  document.head.appendChild(script)
}

export { gsCall }
