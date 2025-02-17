import { Link } from "react-router-dom";
import {
    Crown,
    Home,
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
        <>
            <nav className="bg-primary p-4 shadow-md">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-primary-foreground text-2xl font-bold italic flex items-center gap-2"
                    >
                        <img
                            src={"/logo_ext2.svg"}
                            alt={"VolleyMatcher Logo"}
                            className={"w-60 h-auto"}
                        />
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* Desktop Navigation */}
                        <div className="hidden sm:flex gap-6">
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
                                    <span className="hidden sm:inline">
                                        Jogos
                                    </span>
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
                                        <Link to="/admin">
                                            <Home size={20} />
                                            <span className="hidden sm:inline">
                                                Painel do Administrador
                                            </span>
                                        </Link>
                                    </Button>
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
                                className="w-64 bg-background"
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
                                            className="w-full text-left justify-start"
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
                                            className="w-full text-left justify-start"
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
                                            className="w-full text-left justify-start"
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
                                                    className="w-full text-left justify-start"
                                                >
                                                    <Link to="/admin">
                                                        <Home size={20} />
                                                        Painel do Administrador
                                                    </Link>
                                                </Button>
                                            </SheetClose>
                                            <SheetClose asChild>
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    className="w-full text-left justify-start"
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
                                                    className="w-full text-left justify-start text-destructive hover:text-red-500"
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
                                                className="w-full text-left bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
        </>
    );
};
