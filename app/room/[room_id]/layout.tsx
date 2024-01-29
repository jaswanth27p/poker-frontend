import { SocketProvider } from "../_components/SocketContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SocketProvider>{children}</SocketProvider>
    </>
  );
}
