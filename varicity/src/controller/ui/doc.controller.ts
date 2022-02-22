// @ts-ignore
import Factory from "../../../public/images/Factory.png"
// @ts-ignore
import Strategy from "../../../public/images/Strategy.png"
// @ts-ignore
import Template from "../../../public/images/Template.png"
// @ts-ignore
import Decorator from "../../../public/images/Decorator.png"
// @ts-ignore
import Entrypoint from "../../../public/images/Entrypoint.png"
// @ts-ignore
import Hotspot_Variant from "../../../public/images/Hotspot_Variant.png"
// @ts-ignore
import Hotspot_VP from "../../../public/images/Hotspot_VP.png"
// @ts-ignore
import Non_Hotspot from "../../../public/images/Non_Hotspot.png"
// @ts-ignore
import Street_Entrypoint from "../../../public/images/Street_Entrypoint.png"
// @ts-ignore
import Street_Inheritance from "../../../public/images/Street_Inheritance.png"
// @ts-ignore
import Street_Usage from "../../../public/images/Street_Usage.png"
// @ts-ignore
import Street_Usage_Underground from "../../../public/images/Street_Usage_Underground.png"
// @ts-ignore
import Sidebar_Class from "../../../public/images/Sidebar_Class.png"

export class DocController {
    public static buildDoc() {
        (document.getElementById("factory_img") as HTMLImageElement).src = Factory;
        (document.getElementById("strategy_img") as HTMLImageElement).src = Strategy;
        (document.getElementById("template_img") as HTMLImageElement).src = Template;
        (document.getElementById("decorator_img") as HTMLImageElement).src = Decorator;
        (document.getElementById("entrypoint_img") as HTMLImageElement).src = Entrypoint;
        (document.getElementById("hotspot_variant_img") as HTMLImageElement).src = Hotspot_Variant;
        (document.getElementById("hotspot_vp_img") as HTMLImageElement).src = Hotspot_VP;
        (document.getElementById("non_hotspot_img") as HTMLImageElement).src = Non_Hotspot;
        (document.getElementById("street_entrypoint_img") as HTMLImageElement).src = Street_Entrypoint;
        (document.getElementById("street_inheritance_img") as HTMLImageElement).src = Street_Inheritance;
        (document.getElementById("street_usage_img") as HTMLImageElement).src = Street_Usage;
        (document.getElementById("street_usage_underground_img") as HTMLImageElement).src = Street_Usage_Underground;
        (document.getElementById("sidebar_class_img") as HTMLImageElement).src = Sidebar_Class;

        document.getElementById("doc_content").style.display = "none";

        document.getElementById("documentation").onclick = (me) => {
            if (me.target == document.getElementById("documentation")) {
                const content = document.getElementById("doc_content");
                if (content.style.display == "block") content.style.display = "none";
                else content.style.display = "block";
            }
        }
    }
}