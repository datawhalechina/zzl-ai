(function () {
  const throttle = function (type: string, name: string, obj: Window = window) {
    let running = false

    const func = () => {
      if (running) {
        return
      }

      running = true
      requestAnimationFrame(() => {
        obj.dispatchEvent(new CustomEvent(name))
        running = false
      })
    }

    obj.addEventListener(type, func)
  }

  if (typeof window !== 'undefined') {
    throttle('resize', 'optimizedResize')
  }
})()
