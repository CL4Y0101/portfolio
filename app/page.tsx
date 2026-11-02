import { MainMenuScreen } from "@/components/game-menu/MainMenuScreen";

/**
 * Root route is the main menu page: the Minecraft-style world menu stands
 * on its own page, and Start navigates to the portfolio landing at
 * /portfolio. The menu root renders fixed full-screen, so it is returned
 * directly without a wrapping landmark (its own inert logic manages the
 * rest of the page while it is open).
 */
export default function MenuPage() {
  return <MainMenuScreen />;
}
