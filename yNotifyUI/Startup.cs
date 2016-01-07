using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(yNotifyUI.Startup))]
namespace yNotifyUI
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
