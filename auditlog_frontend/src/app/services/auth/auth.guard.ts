import { CanActivateFn } from "@angular/router";

export const AuthGuard: CanActivateFn = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        return true;
    } else {
        window.location.href = '/login';
        return false;
    }
};