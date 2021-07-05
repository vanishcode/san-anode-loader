/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file example entry
 * @author clark-t
 */

import {Component} from 'san';

import styles from '../style.module.less';

export default class Text extends Component {
    static template = /* html */`
        <div class="{{styles.text}}">
            hello luoyi_maid!
        </div>
    `;

    static computed = {
        filterText() {
            return `<em class="{{styles.amount}}">10</em>`;
        }
    };

    static component = {

    };

    initData() {
        return {
            container: 'luoyi06',
            styles
        };
    }
    inited() {
        console.log('component inited');
    }

    attached() {
        console.log('component attached');
    }
};