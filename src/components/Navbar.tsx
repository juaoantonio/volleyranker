import { Link } from "react-router-dom";
import {
    Crown,
    LogIn,
    LogOut,
    Menu,
    PlusCircle,
    Users,
    Volleyball,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth.ts";
import { logout } from "../services/auth.ts";

// Componentes do shadcn/ui
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";

export const Navbar = () => {
    const { user } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="bg-primary fixed z-20 flex h-16 w-full justify-between p-4 shadow-md">
            <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-primary-foreground flex items-center gap-2 text-2xl font-bold italic"
                >
                    <img
                        src={"/logo_ext2.svg"}
                        alt={"VolleyMatcher Logo"}
                        className={"h-auto w-60"}
                    />
                </Link>

                <div className="flex items-center gap-4">
                    {/* Desktop Navigation */}
                    <div className="hidden gap-6 sm:flex">
                        <Button
                            asChild
                            variant="ghost"
                            className="text-primary-foreground hover:text-muted-foreground"
                        >
                            <Link to="/">
                                <Crown size={18} />
                                <span className="hidden sm:inline">
                                    Ranking Geral
                                </span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="ghost"
                            className="text-primary-foreground hover:text-muted-foreground"
                        >
                            <Link to="/games">
                                <Volleyball size={20} />
                                <span className="hidden sm:inline">Jogos</span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="ghost"
                            className="text-primary-foreground hover:text-muted-foreground"
                        >
                            <Link to="/team">
                                <Users size={20} />
                                <span className="hidden sm:inline">
                                    Gerar Times
                                </span>
                            </Link>
                        </Button>

                        {user ? (
                            <>
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="text-primary-foreground hover:text-muted-foreground"
                                >
                                    <Link to="/admin/add">
                                        <PlusCircle size={20} />
                                        <span className="hidden sm:inline">
                                            Adicionar Jogador
                                        </span>
                                    </Link>
                                </Button>
                                <Button
                                    onClick={handleLogout}
                                    variant="ghost"
                                    className="text-destructive hover:text-red-500"
                                >
                                    <LogOut size={20} />
                                    <span className="hidden sm:inline">
                                        Sair
                                    </span>
                                </Button>
                            </>
                        ) : (
                            <Button
                                asChild
                                variant="default"
                                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            >
                                <Link to="/login">
                                    <LogIn size={20} />
                                    <span className="hidden sm:inline">
                                        Entrar
                                    </span>
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu com Sheet */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Menu
                                size={28}
                                className="text-primary-foreground sm:hidden"
                            />
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="bg-background w-64"
                        >
                            <SheetHeader>
                                <div className="flex items-center justify-between">
                                    <SheetTitle>Menu</SheetTitle>
                                </div>
                            </SheetHeader>
                            <div className="mt-4 space-y-4">
                                <SheetClose asChild>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="w-full justify-start text-left"
                                    >
                                        <Link to="/">
                                            <Crown size={20} />
                                            Ranking Geral
                                        </Link>
                                    </Button>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="w-full justify-start text-left"
                                    >
                                        <Link to="/games">
                                            <Volleyball size={20} />
                                            Jogos
                                        </Link>
                                    </Button>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="w-full justify-start text-left"
                                    >
                                        <Link to="/team">
                                            <Users size={20} />
                                            Gerar Times
                                        </Link>
                                    </Button>
                                </SheetClose>
                                {user ? (
                                    <>
                                        <SheetClose asChild>
                                            <Button
                                                asChild
                                                variant="ghost"
                                                className="w-full justify-start text-left"
                                            >
                                                <Link to="/admin/add">
                                                    <PlusCircle size={20} />
                                                    Adicionar Jogador
                                                </Link>
                                            </Button>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Button
                                                onClick={handleLogout}
                                                variant="ghost"
                                                className="text-destructive w-full justify-start text-left hover:text-red-500"
                                            >
                                                <LogOut size={20} />
                                                Sair
                                            </Button>
                                        </SheetClose>
                                    </>
                                ) : (
                                    <SheetClose asChild>
                                        <Button
                                            asChild
                                            variant="default"
                                            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 w-full text-left"
                                        >
                                            <Link to="/login">
                                                <LogIn size={20} />
                                                Entrar
                                            </Link>
                                        </Button>
                                    </SheetClose>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
};
