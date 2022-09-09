/** @jsx h */

import { h } from "preact";
import Layout from "../../components/Layout.tsx";
import NavBarGUI from "../../components/NavBarGUI.tsx";
import Connections from "../../islands/Connections.tsx";

export default function connections() {
  return (
    <Layout>
      <NavBarGUI active="/connections" />
      <Connections />
    </Layout>
  );
}
