import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Menu, MessageSquare, Settings, User, History } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function Sidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const NavButton = ({ onClick, children }) => (
    <Button
      variant="ghost"
      className="w-full justify-start h-12 px-4 rounded-xl"
      onClick={onClick}
      type="button"
    >
      {children}
    </Button>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" type="button">
        <Menu className="h-4 w-4" />
      </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 z-[1000]">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>{t('chat.title')}</SheetTitle>
        </SheetHeader>

        <div className="p-3">
          <nav className="flex flex-col gap-2">
            <SheetClose asChild>
              <NavButton onClick={() => { navigate('/chat'); }}>
                <MessageSquare className="h-4 w-4 mr-3" />
                <span>{t('chat.new_chat') || 'New Chat'}</span>
              </NavButton>
            </SheetClose>
            <SheetClose asChild>
              <NavButton onClick={() => { navigate('/history'); }}>
                <History className="h-4 w-4 mr-3" />
                <span>{t('chat.history') || 'History'}</span>
              </NavButton>
            </SheetClose>
            <SheetClose asChild>
              <NavButton onClick={() => { navigate('/profile'); }}>
                <User className="h-4 w-4 mr-3" />
                <span>{t('chat.profile') || 'Profile'}</span>
              </NavButton>
            </SheetClose>
            <SheetClose asChild>
              <NavButton onClick={() => { navigate('/settings'); }}>
                <Settings className="h-4 w-4 mr-3" />
                <span>{t('chat.settings') || 'Settings'}</span>
              </NavButton>
            </SheetClose>
            </nav>
          </div>
          
        <SheetFooter className="mt-auto border-t px-6 py-4">
          <SheetClose asChild>
            <Button variant="outline" className="w-full h-12 rounded-xl" onClick={handleLogout} type="button">
              {t('chat.logout') || 'Logout'}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
