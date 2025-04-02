document.addEventListener('DOMContentLoaded', () => {
    const trailers = {
        dump: {
           bp: ['tandem', 'triple', 'dual'],
           gn: ['tandem', 'triple', 'dual']
        },
        car_hauler: {
           bp: ['tandem_1_car', 'tandem_2_car', 'triple_2_car'],
           gn: ['tandem_2_car', 'triple_2_car', 'triple_3_car', 'triple_4_car', 'triple_5_car']
        },
        flatbed: {
            gn: ['tandem', 'triple', 'triple_dual', 'dual']
        },
        gravity_tilt: {
            bp: ['tandem_102_deck', 'tandem_80_deck'],
            gn: ['tandem_102_deck', 'tandem_80_deck']
        },
        power_tilt: {
            gn: ['tandem', 'dual']
        },
        lowboy: {
            bp: ['tandem_102_deck_no_rails', 'tandem_102_deck_rails', 'tandem_80_deck_no_rails', 'tandem_80_deck_rails', 'triple_102_deck_no_rails', 'triple_102_deck_rails', 'triple_80_deck_no_rails', 'triple_80_deck_rails'],
            gn: ['tandem_102_deck_no_rails', 'tandem_102_deck_rails', 'tandem_80_deck_no_rails', 'tandem_80_deck_rails', 'triple_102_deck_rails', 'triple_102_deck_no_rails', 'triple_80_deck_no_rails', 'triple_80_deck_rails']
        },
        roll_off: {
            bp: ['tandem'],
            gn: ['tandem', 'tandem_multican', 'dual']
        }
    }
    const keywords = ["dump", "lowboy", "flatbed", "power_tilt", "car_hauler", "roll_off", "gravity_tilt"]

    function highlightCategoryFromURL(url, keywords) {
        url = url.replace(/-/g, '_')
        const regex = new RegExp(`(^|[^a-zA-Z0-9])(${keywords.join("|")})($|[^a-zA-Z0-9])`, "i")
        const match = url.match(regex)
    
        return match ? match[2] : null
    }

    // test part, remove after testing
    const testURL = document.querySelector('.check__link')
    const testBtn = document.querySelector('#checkBtn')
    let category =  ""

    testBtn.addEventListener('click', () => {
        const pageURL = testURL.value.trim()
        if(category = highlightCategoryFromURL(pageURL, keywords)) {
            generateTabs(category)
            tabsContainer.style.display='block' 
        } else {
            alert ('Incorrect link') 
            tabsContainer.style.display='none' 
            return
        }
    })

    //const pageURL = window.location.pathname     add this when this code will transfer to wp
    //const category = highlightCategoryFromURL(pageURL, keywords)
    const tabsContainer = document.querySelector('.tabs') 

    if(!category || !trailers[category]) return

    function generateTabs() {
        tabsContainer.innerHTML = ''

        const tabWrap = document.createElement('ul')
        tabWrap.classList.add('tabs-titles__list')
    
        let tabContent = document.querySelector('.tabs-content__list')
        if (!tabContent) {
            tabContent = document.createElement('ul')
            tabContent.classList.add('tabs-content__list')
            tabsContainer.after(tabContent)
        }
    
        Object.keys(trailers[category]).forEach((type) => {
            const tabTitle = document.createElement('li')
            tabTitle.classList.add('tabs-titles__item')
            tabTitle.setAttribute('data-tab', type)
            tabTitle.textContent = type === 'bp' ? "Bumper Pull" : "Gooseneck"
    
            tabTitle.addEventListener('click', () => {
                document.querySelectorAll('.tabs-titles__item').forEach(t => t.classList.remove('active'))
                tabTitle.classList.add('active')
                generateSubTypes(category, type)
            })
    
            tabWrap.appendChild(tabTitle)
        })
    
        tabsContainer.innerHTML = ''
        tabsContainer.appendChild(tabWrap)
    
        if (tabWrap.firstChild) {
            tabWrap.firstChild.classList.add('active')
            generateSubTypes(category, Object.keys(trailers[category])[0])
        }
    }
    
    function generateSubTypes(category, type) {
        const tabContent = document.querySelector('.tabs-content__list')
        if (!tabContent) return
    
        tabContent.innerHTML = '' 
    
        if (!trailers[category] || !trailers[category][type]) return
    
        trailers[category][type].forEach((subType, index) => {
            const modelSrc = `https://s3.us-east-2.amazonaws.com/ar.texaspridetrailers.com/${category}_${type}_${subType}.glb`
            const tabItem = document.createElement('li')
            tabItem.classList.add('tabs-content__item')
            tabItem.setAttribute('data-model', subType)

            const subTypeTitle = subType.replace('_', ' ')

            const axleImg = document.createElement('img')
            axleImg.classList.add('tabs-content__item-img')
            axleImg.src = `images/${type}-${subType}.png` 
            axleImg.alt = subType
    
            const axleText = document.createElement('div')
            axleText.classList.add('tabs-content__item-text')
            axleText.textContent = subTypeTitle

            tabItem.appendChild(axleImg)
            tabItem.appendChild(axleText)
            tabContent.appendChild(tabItem)
            tabsContainer.appendChild(tabContent)

            if(index === 0) {
                tabItem.classList.add('active')
                loadModel(modelSrc)
            }

            tabItem.addEventListener('click', () => {
                document.querySelectorAll('.tabs-content__item').forEach(t => t.classList.remove('active'))
                tabItem.classList.add('active')
                
                loadModel(modelSrc)
            })
        })

        tabsContainer.appendChild(tabContent) 
    }
    
    generateTabs()
})

const modelCache = {}

function loadModel(modelSrc) {
    return new Promise((resolve) => {
        const modelContainer = document.querySelector('#modelContainer')
        if (!modelContainer) return

        if (modelCache[modelSrc]) {
            const modelViewer = modelContainer.querySelector('model-viewer')
            if (modelViewer) {
                modelViewer.setAttribute('src', modelSrc)
            }
            return resolve(modelCache[modelSrc])
        }

        const modelViewer = document.createElement('model-viewer')
        modelViewer.setAttribute('src', modelSrc)
        modelViewer.setAttribute('auto-rotate', '')
        modelViewer.setAttribute('camera-controls', '')
        modelViewer.setAttribute('ar', '')
        modelViewer.setAttribute('camera-orbit', '270deg 75deg 10m')
        modelViewer.setAttribute('shadow-intensity', '1')

        modelViewer.style.width = '99vw'
        modelViewer.style.height = '800px'

        modelViewer.addEventListener('load', function () {
            modelCache[modelSrc] = modelViewer
            resolve(modelViewer)
        })

        modelContainer.innerHTML = ''
        modelContainer.appendChild(modelViewer)
    })
}
