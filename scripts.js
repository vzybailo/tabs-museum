const tabs = document.querySelectorAll(".tabs-titles__item")
const tabsCont = document.querySelectorAll(".tabs-content__item")

tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {     
        tabs.forEach(item => item.classList.remove('active'))
        tabsCont.forEach(tabCont => tabCont.classList.remove('active'))

        tabs.forEach(item => item.style.borderBottom = '');

        tab.classList.add('active')
        document.querySelector(`#tab-${tab.dataset.tab}`).classList.add('active')

        for (let i = 0; i < index; i++) {
            tabs[i].style.borderBottom = '3px solid red';
        }
    })
})

tabs[0].classList.add('active')
tabsCont[0].classList.add('active')
