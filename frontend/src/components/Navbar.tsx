import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { CodeXml } from "lucide-react";

export default function () {

    return (
        <header className="dark:text-white px-4 lg:px-6 h-14 flex items-center justify-between" >
            <Link
                to="/"
                className="flex items-center justify-center"
            >
                <CodeXml className="h-6 w-6" />
                <span className="dark:text-white font-bold text-xl p-2">
                    Codemasters
                </span>
            </Link>
            <nav className="hidden items-center gap-2 text-sm font-medium md:flex">
                <Link to="/">
                    <Button variant="ghost" color="black">
                        Home
                    </Button>
                </Link>
                <Link to="/questions/new">
                    <Button variant="ghost">Create Problem</Button>
                </Link>
                <Link to="/about">
                    <Button variant="ghost">About</Button>
                </Link>
                {/* {userData && <UserProfileModal user={userData} />}
                {!userData && (
                    <Link to="/auth/signin">
                        <Button>Login</Button>
                    </Link>
                )} */}
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button className="md:hidden" size="icon" variant="outline">
                        <MenuIcon className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <div className="grid gap-6 p-6">
                        <Link to="/home">
                            <Button variant="ghost" color="black">
                                Home
                            </Button>
                        </Link>
                        <Link to="/questions/new">
                            <Button variant="ghost">Create Problem</Button>
                        </Link>
                        <Link to="/about">
                            <Button variant="ghost">About</Button>
                        </Link>
                        <Link to="/groups">
                            <Button variant="ghost">Groups</Button>
                        </Link>
                        <Link to="/auth/signin">
                            <Button>Sign In</Button>
                        </Link>
                    </div>
                </SheetContent>
            </Sheet>
        </header>
    );
}