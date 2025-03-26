// tabs for bumper pull and goosneck
const tabs = document.querySelectorAll(".tabs-titles__item")
const tabsCont = document.querySelectorAll(".tabs-content__item")

tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {     
        tabs.forEach(item => item.classList.remove('active'))
        tabsCont.forEach(tabCont => tabCont.classList.remove('active'))

        tabs.forEach(item => item.style.borderBottom = '')

        tab.classList.add('active')
        document.querySelector(`#tab-${tab.dataset.tab}`).classList.add('active')
    })
})

tabs[0].classList.add('active')
tabsCont[0].classList.add('active')

// tabs for tandem, triple and dual
document.addEventListener('DOMContentLoaded', function () {
    const modelContainer = document.getElementById('modelContainer')
    const items = document.querySelectorAll('.axle__item')

    let preloadedModels = {}

    function loadModel(modelSrc, isBackground = false) {
        return new Promise((resolve) => {
            const modelViewer = document.createElement('model-viewer')
            modelViewer.setAttribute('src', modelSrc)
            modelViewer.setAttribute('auto-rotate', '')
            modelViewer.setAttribute('camera-controls', '')
            modelViewer.setAttribute('ar', '')
            modelViewer.setAttribute('camera-orbit', '270deg 75deg 10m')
            modelViewer.setAttribute('shadow', 'true');
            modelViewer.setAttribute('shadow-intensity', '1');
            modelViewer.setAttribute('shadow-softness', '0');

            modelViewer.style.width = '99vw'
            modelViewer.style.height = '800px'

            modelViewer.addEventListener('load', function () {
                if (!isBackground) 
                resolve(modelViewer)
            })

            if (!isBackground) {
                modelContainer.innerHTML = ''
                modelContainer.appendChild(modelViewer)
            }
            
            preloadedModels[modelSrc] = modelViewer // Сохраняем загруженную модель
        })
    }

    // Устанавливаем первую вкладку активной
    items[0].classList.add('active')
    const firstModelSrc = items[0].getAttribute('data-model')
    loadModel(firstModelSrc)

    // Загружаем остальные модели в фоне
    items.forEach(item => {
        const modelSrc = item.getAttribute('data-model')
        if (modelSrc !== firstModelSrc) {
            loadModel(modelSrc, true) // Фоновая загрузка
        }
    })

    // Обработчик кликов по вкладкам
    items.forEach(item => {
        item.addEventListener('click', function () {
            const modelSrc = this.getAttribute('data-model')
            if (!modelSrc) return

            console.log(modelSrc)

            items.forEach(el => el.classList.remove('active'))
            this.classList.add('active')

            if (!preloadedModels[modelSrc]) {
                loadModel(modelSrc)
            } else {
                modelContainer.innerHTML = ''
                modelContainer.appendChild(preloadedModels[modelSrc].cloneNode(true))
            }
        })
    })
})

