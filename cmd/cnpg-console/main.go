package main

import (
	"fmt"
	"os"

	"github.com/firemanxbr/cnpg-console/internal/cli"
	"github.com/spf13/cobra"
)

var version = "dev"

func main() {
	root := &cobra.Command{
		Use:     "cnpg-console",
		Short:   "CLI installer and manager for CNPG Console",
		Version: version,
	}

	root.AddCommand(cli.NewInstallCmd())
	root.AddCommand(cli.NewCheckCmd())
	root.AddCommand(cli.NewUninstallCmd())

	if err := root.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
