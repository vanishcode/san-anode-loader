import san from 'san';

import App from './App';
import Video from './video';

const App2 = san.defineComponent({
    template: /* html */ `
        <div class="demo-wrapper">
            <ui-demo />
        </div>
    `,
    components: {
        'ui-demo': Video
    },
    initData() {
        return {
        };
    }
});

const app1 = new App();
app1.attach(document.getElementById('app1'));

const app2 = new App2();
app2.attach(document.getElementById('app2'));
