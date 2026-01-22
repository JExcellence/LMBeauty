"use client";

import {
    BorderStyle,
    IconProvider, LayoutProvider, NeutralColor, ScalingSize, Schemes, SolidStyle, SolidType, SurfaceStyle,
    ThemeProvider,
    ToastProvider, TransitionStyle,
} from '@once-ui-system/core';
import {style} from '@/resources/once-ui.config';
import { iconLibrary } from '@/resources/icons';
import { AuthProvider } from '@/contexts/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LayoutProvider>
            <ThemeProvider
                brand={style.brand as Schemes}
                accent={style.accent as Schemes}
                neutral={style.neutral as NeutralColor}
                solid={style.solid as SolidType}
                solidStyle={style.solidStyle as SolidStyle}
                border={style.border as BorderStyle}
                surface={style.surface as SurfaceStyle}
                transition={style.transition as TransitionStyle}
                scaling={style.scaling as ScalingSize}
            >
                <ToastProvider>
                    <IconProvider icons={iconLibrary}>
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                    </IconProvider>
                </ToastProvider>
            </ThemeProvider>
        </LayoutProvider>
    );
}
