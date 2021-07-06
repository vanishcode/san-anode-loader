/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file example entry
 * @author clark-t
 */

import { Component } from 'san';
import Text from './component/text';
import styles from './style.module.less';
console.log(styles);

export default class Video extends Component {
    static template = /* html */ `
        <div class="{{styles.searchWordItem}}">
            hello world!
            <led-text class="{{styles.componentText}}" style="border: 1px solid red;"/>
        </div>
    `;

    static computed = {
        filterText() {
            return `<em class="{{styles.amount}}">10</em>`;
        },
    };

    static components = {
        'led-text': Text,
    };

    static component = {};

    initData() {
        return {
            container: 'luoyi06',
            styles,
        };
    }
    inited() {
        console.log('inited');
    }

    attached() {
        console.log('attached');
    }
}
