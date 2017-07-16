var title = document.title;

var patterns = ["Orange/Brown", "Green/Turquoise", "Orange/Cream", "White/Red", "Purple/Orange", "Blue/Light Blue", "Purple/Yellow", "Blue/Green", "Green/Cream", "Orange/Turquoise", "Magenta/Green", "Blue/Yellow", "Purple/Green", "Green/Indigo", "Turquoise/Magenta", "Blue/White"];
var emeralds = ["Green", "Red", "Purple", "Blue", "Grey", "Red", "Light Blue", "Yellow"];
var picnum = [1, 3, 1, 3, 0, 2, 0, 2, 1, 3, 1, 3, 0, 2, 0, 2];
var picltr = ["b", "d", "b", "d", "a", "c", "a", "c", "b", "d", "b", "d", "a", "c", "a", "c"];

function write_page(act, type, usebackground, lev, stgc, pmnc, dat, cod, com)
{
  var page;

  switch (act)
  {
    case "normalmap":
    case "expandedmap":
    case "custom":
      var bg = (usebackground ? " style=\"background-image: url('background" + dat[3] + ".png');\"" : "");

      page = "<table summary=\"Info\">\n<tr><td>";

      if (type == "stage")
        page += "Stage:</td><td>" + stgc + "</td></tr>\n<tr><td>" +
                "Level:</td><td>" + lev + "</td></tr>\n";
      else
        page += "Level:</td><td>" + lev + com + "</td></tr>\n<tr><td>" +
                "Stage:</td><td>" + stgc + "</td></tr>\n";

      page += "<tr><td>Code:</td><td>" + cod + "</td></tr>\n" +
              "<tr><td>Difficulty: </td><td>" + dat[2] + "</td></tr>\n" +
              "<tr><td>Pattern:</td><td><img src=\"pattern" + dat[3] + ".png\" title=\"" + patterns[dat[3]] + "\" alt=\"" + patterns[dat[3]] + "\"/></td></tr>\n" +
              "<tr><td>Emerald:</td><td><img src=\"emerald" + dat[4] + ".png\" title=\"" + emeralds[dat[4]] + "\" alt=\"" + emeralds[dat[4]] + "\"/></td></tr>\n" +
              "<tr><td colspan=\"2\"><img src=\"bluesphere.png\" title=\"Blue Spheres\" alt=\"Blue Spheres\"/> x " + dat[0] + " / <img src=\"ring.png\" title=\"Rings\" alt=\"Rings\"/> x " + dat[1] + "</td></tr>\n" +
              "</table>\n" +
              "<table summary=\"Map\" class=\"map\">\n<tr>";

      if (act == "expandedmap")
      {
        for (var i = 0; i < 4; i++)
          page += "<td align=\"center\">&#8595; " + pmnc[picnum[i]] + " &#8595;</td>";

        page += "</tr>\n<tr" + bg + ">";

        for (i = 0; i < 16; i++)
        {
          page += "<td><img src=\"" + pmnc[picnum[i]] + "-" + picltr[i] + ".png\" alt=\"[Section " + pmnc[picnum[i]] + "]\" /></td>";

          if ((i+1)%4 == 0 && i != 15)
            page += "</tr>\n<tr" + bg + ">";
        }

        page += "</tr>\n<tr>";

        for (i = 4; i < 8; i++)
          page += "<td align=\"center\">&#8593; " + pmnc[picnum[i]] + " &#8593;</td>";
      }
      else
      {
        for (var i = 5; i > 3; i--)
          page += "<td align=\"center\">&#8595; " + pmnc[picnum[i]] + " &#8595;</td>";

        page += "</tr>\n<tr" + bg + ">";

        for (i = 5; i > 1; i--)
        {
          page += "<td><img src=\"" + pmnc[picnum[i]] + "-" + picltr[i] + ".png\" alt=\"[Section " + pmnc[picnum[i]] + "]\" /></td>";

          if (i%2 == 0 && i != 2)
            page += "</tr>\n<tr" + bg + ">";
        }
        page += "</tr>\n<tr>";

        for (i = 3; i > 1; i--)
          page += "<td align=\"center\">&#8593; " + pmnc[picnum[i]] + " &#8593;</td>";
      }

      page += "</tr>\n</table>\n<br />\n<br />\n";
      break;

    case "codes":
      page = (type == "stage" ? stgc : lev) + ": " + cod + "<br />\n";
      break;

    case "verbose":
      page = "<tr><td>";

      if (type == "stage")
        page += stgc + "</td><td>" + lev;
      else
        page += lev + "</td><td>" + stgc;

      page += "</td><td>" + dat[0] + "</td><td>" + dat[1] + "</td><td>" + dat[2] + "</td><td>" + patterns[dat[3]] + "</td><td>" + emeralds[dat[4]] + "</td><td>" + cod + "</td></tr>\n";
  }

  return page;
}

function bs_process(act, type, start, end, a, b, c, d, usebackground, sonic1cart, process_args)
{
  var range_txt, title_txt, cont, k, page = "";
  var lev, stg, stgc, pmn, pmnc, dat, cod, com;
  var num_levels = end - start + 1, plural = num_levels != 1, total_bluespheres = 0, total_rings = 0, total_diff = 0;

  if (usebackground == undefined)
    usebackground = false;
  if (sonic1cart == undefined)
    sonic1cart = true;
  if (process_args == undefined)
    process_args = false;

  range_txt = (type == "stage" ? "Stage" : "Level") + (plural ? "s " + start + " to " + end : " " + start);
  title_txt = title + " : ";

  switch (act)
  {
    case "normalmap":
    case "expandedmap":
      title_txt += range_txt + " - " + (act == "normalmap" ? "Map" : "Expanded Map") + (plural ? "s" : "");
      break;
    case "verbose":
      title_txt += range_txt + " - Verbose Info";
      break;
    case "codes":
      title_txt += range_txt;
      break;
    case "custom":
      title_txt += "Custom Stage " + c + " - " + a + " - " + d + " - " + b;
  }

  if (!sonic1cart)
    title_txt += " (Non Sonic 1 Cartridge)";

  document.title = title_txt;


  if (act == "verbose")
  {
    page += "<table summary=\"Info\" class=\"t\">\n<tr><td>";
    if (type == "stage")
      page += "Stage</td><td>Level";
    else
      page += "Level</td><td>Stage";
    page += "</td><td>B. Sph.</td><td>Rings</td><td>Difficulty</td><td>Pattern</td><td>Emerald</td><td>Code</td></tr>\n";
  }
  else if (act == "codes")
  {
    if (type == "stage")
      page += "Stage";
    else
      page += "Level";
    page += (plural ? "s " + start + " to " + end : " " + start) + (sonic1cart ? "" : " (Non Sonic 1 Cartridge)") + ":<br />\n";
  }

  if (act == "custom")
  {
    if (numcheck(a, Math.floor(a), 0, 127) == 0 && numcheck(b, Math.floor(b), 0, 127) == 0 && numcheck(c, Math.floor(c), 0, 127) == 0 && numcheck(d, Math.floor(d), 0, 127) == 0)
    {
      stg = 128*128*128*Math.floor(a) + 128*128*Math.floor(b) + 128*Math.floor(c) + Math.floor(d);
      stgc = chrstg(stg);
      pmn = stgtopmn(stg);
      pmnc = chrpmn(pmn);
      dat = pmntodat(pmn);
      lev = pmntolev(pmn);
      cod = (isNaN(lev) ? "(none)" : levtocod(lev, sonic1cart));

      page += write_page(act, "stage", usebackground, lev, stgc, pmnc, dat, cod, "");
    }
    else
      return false;
  }
  else
  {
    if (numcheck(start, Math.floor(start), (type == "stage" ? 0 : 1), (type == "stage" ? 268435455 : 134217728)) == 0 &&
        numcheck(end, Math.floor(end), (type == "stage" ? 0 : 1), (type == "stage" ? 268435455 : 134217728)) == 0)
    {
      cont = true;

      if (num_levels > 1000)
      {
        cont = confirm("WARNING! Generating more than 1000 levels may take a _long_ time and may cause your browser to hang.\n\nAre you sure you want to continue?");
      }
      if (cont)
      {
        for (k = Math.floor(start); k <= end; k++)
        {
          if (type == "stage")
          {
            stg = k;
            stgc = chrstg(stg);
            pmn = stgtopmn(stg);
            if (act != "codes") /* don't calculated unneeded info for code-only mode */
            {
              dat = pmntodat(pmn);
              pmnc = chrpmn(pmn);
            }
            lev = pmntolev(pmn);
            cod = (isNaN(lev) ? "(none)" : levtocod(lev, sonic1cart));
          }
          else
          {
            lev = k;
            cod  = levtocod(lev, sonic1cart);
            if (act != "codes")
            {
              pmn = levtopmn(lev);
              pmnc = chrpmn(pmn);
              stg = pmntostg(pmn);
              stgc = chrstg(stg);
              dat = pmntodat(pmn);
              com = (lev > 128016000 ? " (and " + (lev - 128016000) + ")" : "");
            }
          }

          page += write_page(act, type, usebackground, lev, stgc, pmnc, dat, cod, com);

          if (act == "verbose")
          {
            total_bluespheres += dat[0];
            total_rings += dat[1];
            total_diff += (dat[2] == "MAX" ? 13 : dat[2]);
          }
        }

        if (act == "verbose")
          page += "<tr><td colspan=\"2\">Average:</td><td>" + Math.round(total_bluespheres / num_levels * 100) / 100 + "</td><td>" + Math.round(total_rings / num_levels * 100) / 100 + "</td><td>" + Math.round(total_diff / num_levels * 100) / 100 + "</td><td colspan=\"3\"></td></tr>\n<tr><td colspan=\"2\">Total:</td><td>" + total_bluespheres + "</td><td>" + total_rings + "</td><td colspan=\"4\"></td></tr>\n</table>\n<br />\n";
        else if (act == "codes")
          page += "<br />\n";
      }
      else
        return false;
    }
    else
      return false;
  }

  if (!process_args)
    page += "<a onclick=\"javascript:reset_page();\" class=\"ln\">Return</a><br />\n<br />\n";

  page += "<a href=\"http://drspud.no-ip.com/bluesphere/?act=" + act + (type == "level" || act == "custom" ? "" : "&amp;type=" + type) + (act == "custom" ? "&amp;a=" + a + "&amp;b=" + b + "&amp;c=" + c + "&amp;d=" + d : "&amp;" + (num_levels > 1 ? "start=" + start + "&amp;end=" + end : "n=" + start)) + (usebackground ? "&amp;usebackground=true" : "") + (sonic1cart ? "" : "&amp;nonsonic1cart=true") + "\">Link to this page</a>\n";

  document.getElementById("g").innerHTML = page;
  document.getElementById("m").style.display = "none";
  document.getElementById("g").style.display = "";

  return true;
}


function load()
{
  var t, i, act = "", type = "", val = "", start = "", end = "", a = "", b = "", c = "", d = "", usebackground = false, sonic1cart = true;
  var url = document.location.href;

  args = url.substr(url.indexOf("?") + 1, url.length).split("&");

  for (i = 0; i < args.length; i++)
  {
    t = args[i].split("=");
    if (t.length == 2)
    {
      switch (t[0])
      {
        case "act":
          act = t[1];
          break;
        case "type":
          type = t[1];
          break;
        case "n":
          start = t[1];
          end = t[1];
          break;
        case "start":
          start = t[1];
          break;
        case "end":
          end = t[1];
          break;
        case "a":
          a = Math.round(t[1]);
          break;
        case "b":
          b = Math.round(t[1]);
          break;
        case "c":
          c = Math.round(t[1]);
          break;
        case "d":
          d = Math.round(t[1]);
          break;
        case "usebackground":
          usebackground = true;
          break;
        case "nonsonic1cart":
          sonic1cart = false;
          break;
      }
    }
  }

  if (args.length > 1)
    bs_process(act, type, start, end, a, b, c, d, usebackground, sonic1cart, true);


  var level = [[87170429, "Jump fun 1"], [103110164, "Jump fun 2"], [47819207, "Bounce fun 1"], [83185495, "Bounce fun 2"], [103608281, "Bounce fun 3"], [30883238, "Bounce fun 4"], [5479285, "Bounce fun 5"], [17932203, "Enclosed paths"], [71728810, "Enclosed paths 2"], [38354989, "Enclosed paths 3 (52 25)"], [25403954, "Enclosed paths 4 (Can you <i>not</i> get a perfect?)"], [46324857, "I dare you!"], [126023285, "Very evil"], [66071929, "More evil"], [60276919, "Also evil"], [58743933, "Pretty darn evil"], [126023534, "Simple but evil"], [75215627, "Few 1"], [108589448, "Few 2 (This one's supposed to be hard?)"], [34868172, "Few 3 (Super easy - possibly the easiest?)"], [88166662, "Few 4 (Easy, but a perfect isn't)"], [12452919, "Fewest"], [110581915, "Few Rings"], [112574382, "Tricky 1"], [79200561, "Tricky 2"], [64755176, "Choices"], [41841806, "Maze"], [23411487, "Very few blue spheres in this one ;)"], [96136530, "Maybe a <i>bit</i> annoying"], [15939736, "Back and forth 1"], [123532950, "Back and forth 2"], [69736343, "Back and forth 3"], [996234, "ZigZag"], [81193028, "Follow the yellow brick road (Super easy)"], [90657246, "Columns"], [6973635, "3 rings"], [66747643, "Spirals of death 1"], [38853106, "Spirals of death 2"], [36362522, "Sparse"], [8467985, "Roundabout"], [21419020, "Clusters 1 (Super easy)"], [66249526, "Clusters 2 (Super easy)"], [62264592, "Spirally Clusters"], [97630880, "Barriers"], [92649713, "Backwards fun"]];
  var links = "";

  for (i = 0; i < level.length; i++)
  {
    links += "<a href=\"?act=normalmap&amp;n=" + level[i][0] + "\" onclick=\"javascript:bs_process('normalmap', 'level', " + level[i][0] + ", " + level[i][0] + "); return false;\" class=\"ln\">" + level[i][1] + "</a><br />\n";
  }

  document.getElementById("m").innerHTML += links;
}

function toggle_inputs()
{
  var t = document.getElementById("acu").checked;

  document.getElementById("cu").style.display = (t ? "" : "none");
  document.getElementById("se").style.display = (t ? "none" : "");
}

function reset_page()
{
  document.getElementById("g").style.display = "none";
  document.getElementById("m").style.display = "";
  document.getElementById("g").innerHTML = "<br />\n";
}
