using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace yNotifyUI.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Index()
        {
            return View("Login");// new FilePathResult("~/Views/SignIn/SignIn.html", "text/html");
        }

        public string LoginAuthenticate(string username, string password)
        {
            if (!string.IsNullOrWhiteSpace(username) && !string.IsNullOrWhiteSpace(password) && username.ToLower() == "admin" && password == "admin@123")
                return "Admin";

            return string.Empty;
        }
    }
}