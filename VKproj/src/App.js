
// REACT
import React, {Component, useEffect, useState, useContext, useRef} from 'react';

// CSS
import '@vkontakte/vkui/dist/vkui.css';
import './index.css';

// VK UI COMPONENTS
import {
    AdaptivityProvider,
    AppRoot, Button,
    ConfigProvider, Group, 
    ModalRoot, Panel, ScreenSpinner, 
    View, Root, Epic, Tabbar, 
    TabbarItem, PanelHeader, 
    PanelHeaderBack, Placeholder, 
    SplitLayout, SplitCol
} from '@vkontakte/vkui';

//VK ICONS
import {Icon28ErrorCircleOutline,
    Icon28ClipOutline, Icon28UserCircleOutline,
    Icon28SmartphoneStarsOutline, Icon28WheelOutline, Icon28MasksOutline} from '@vkontakte/icons'

//VK BRIDGE
import bridge from "@vkontakte/vk-bridge";


// TESTING
const testing = true;
//

// функция блока интерфейса
function blockInterface(setIsInterfaceBlockedRef) {
    setIsInterfaceBlockedRef.current(true);
    setTimeout(() => setIsInterfaceBlockedRef.current(false), 1000);
}

async function getDataFromBotBandit({
    type,
    inputData = {},
    // ———————————————————
    popout = null,
    noSetPopout = true,
    setLoading = () => false,
    callback = () => false
}) {
    let popoutOffFlag = false;
    if (popout == null && noSetPopout == false) {
        popoutOffFlag = true;
        setLoading(true);
    }

    try {
        const response = await fetch(testing ? "https://botbandit.ru/app/get.php" : "app/get.php",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: type,
                url: window.location.href,
                data: inputData
            })
        });

        const data = await response.json();
        if (data.error) {
            console.log(data.error);
            return null;
        }

        if (popoutOffFlag) {
            setLoading(false);
        }

        callback(data);

        return data;
    } catch (error) {
        console.log(error);
    }
}

const testUser = {
    "id": 494075,
    "first_name": "Ирина",
    "last_name": "Денежкина",
    "sex": 1,
    "city": {
        "id": 2,
        "title": "Санкт-Петербург"
    },
    "country": {
        "id": 1,
        "title": "Россия"
    },
    "bdate": "10.4.1990",
    "photo_100": "https://pp.userapi.com/c836333/v836333553/5b138/2eWBOuj5A4g.jpg",
    "photo_200": "https://pp.userapi.com/c836333/v836333553/5b137/tEJNQNigU80.jpg",
    "timezone": 3
};

function App() {
    // блокировка интерфейса
    const [isInterfaceBlocked, setIsInterfaceBlocked] = useState(false);
    const setIsInterfaceBlockedRef = useRef(setIsInterfaceBlocked);

    // данные о пользователе
    const [userVK, setUserVK] = useState("");
    const [userBandit, setUserBandit] = useState(null);
    

    // стейт активных view's, panel's
    const [activeStory, setActiveStory] = useState('profile')

    // ставим тему и забираем данные с VK Bridge
    useEffect(() => {
        bridge.subscribe(({detail: {type, data}}) => {
            if (type === 'VKWebAppUpdateConfig') {
                const schemeAttribute = document.createAttribute('scheme');
                schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
                document.body.attributes.setNamedItem(schemeAttribute);
            }
        });

        async function fetchData() {
            const dbData = await getDataFromBotBandit({type: "get_index_info"});
            const vkData = testing ? testUser : await bridge.send('VKWebAppGetUserInfo');

            setUserVK(vkData);
            setUserBandit(dbData);
        }

        fetchData();
    }, []);

    console.log(window.location.href);

    return (
        <ConfigProvider>
            <AdaptivityProvider>
                <AppRoot >
                    <SplitLayout>
                        <SplitCol>
                            <Epic activeStory={activeStory} tabbar={
                            <Tabbar>
                                <TabbarItem
                                onClick={() => setActiveStory("daily-bonus")}
                                selected={activeStory === 'daily-bonus'}
                                data-story="daily-bonus"
                                text="Ежедневный бонус"
                                label="1"
                                ><Icon28SmartphoneStarsOutline /></TabbarItem>
                                <TabbarItem
                                onClick={() => setActiveStory("roulette")}
                                selected={activeStory === 'roulette'}
                                data-story="roulette"
                                text="Рулетка"
                                ><Icon28WheelOutline/></TabbarItem>
                                <TabbarItem
                                onClick={() => setActiveStory("skam")}
                                selected={activeStory === 'skam'}
                                data-story="skam"
                                text="Скам"
                                ><Icon28MasksOutline /></TabbarItem>
                                <TabbarItem
                                onClick={() => setActiveStory("dev")}
                                selected={activeStory === 'dev'}
                                data-story="dev"
                                text="Dev"
                                ><Icon28ErrorCircleOutline /></TabbarItem>
                                <TabbarItem
                                onClick={() => setActiveStory("profile")}
                                selected={activeStory === 'profile'}
                                data-story="profile"
                                text="Профиль"
                                ><Icon28UserCircleOutline /></TabbarItem>
                            </Tabbar>
                            }>
                            <View id="daily-bonus" activePanel="daily-bonus">
                                <Panel id="daily-bonus">
                                <PanelHeader left={<PanelHeaderBack />}>Ежедневный бонус</PanelHeader>
                                <Group style={{ height: '1000px' }}>
                                    <Placeholder icon={<Icon28SmartphoneStarsOutline width={56} height={56} />} />
                                </Group>
                                </Panel>
                            </View>
                            <View id="roulette" activePanel="roulette">
                                <Panel id="roulette">
                                <PanelHeader left={<PanelHeaderBack />}>Джекпот-рулетка</PanelHeader>
                                <Group style={{ height: '1000px' }}>
                                    <Placeholder icon={<Icon28WheelOutline width={56} height={56} />}>
                                    </Placeholder>
                                </Group>
                                </Panel>
                            </View>
                            <View id="skam" activePanel="skam">
                                <Panel id="skam">
                                <PanelHeader left={<PanelHeaderBack />}>Скам</PanelHeader>
                                <Group style={{ height: '1000px' }}>
                                    <Placeholder icon={<Icon28MasksOutline width={56} height={56} />}>
                                    </Placeholder>
                                </Group>
                                </Panel>
                            </View>
                            <View id="dev" activePanel="dev">
                                <Panel id="dev">
                                <PanelHeader left={<PanelHeaderBack />}>В разработке</PanelHeader>
                                <Group style={{ height: '1000px' }}>
                                    <Placeholder icon={<Icon28ErrorCircleOutline width={56} height={56} />}>
                                    </Placeholder>
                                </Group>
                                </Panel>
                            </View>
                            <View id="profile" activePanel="profile">
                                <Panel id="profile">
                                <PanelHeader left={<PanelHeaderBack />}>Профиль</PanelHeader>
                                <Group style={{ height: '1000px' }}>
                                    <Placeholder icon={<Icon28UserCircleOutline width={56} height={56} />}>
                                    </Placeholder>
                                </Group>
                                </Panel>
                            </View>
                            </Epic>
                        </SplitCol>
                        </SplitLayout>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    );
}

export default App;