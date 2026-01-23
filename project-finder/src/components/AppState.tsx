'use client'

import {ConfigProvider} from "taltech-styleguide";


export default function AppState({ children }:
    Readonly<{ children: React.ReactNode; }>) {

    return (
            <ConfigProvider>
                {children}
            </ConfigProvider>
    );
}